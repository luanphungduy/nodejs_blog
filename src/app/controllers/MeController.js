const { multipleMongooseToObject } = require('../../utils/mongoose');
const Course = require('../models/Course');

class MeController {
    // [GET] /me/stored/courses
        async storedCourses(req, res, next) {
            try {
                let courses = await Course.find({});
                
                if (req.query.hasOwnProperty('_sort')) {
                    courses = await Course.find({}).sort({
                        [req.query.column]: req.query.type,
                    })
                }
                
                let deletedCount = await Course.countDocumentsWithDeleted({ deleted: true });

                courses = multipleMongooseToObject(courses);
                res.render('me/stored-courses', { courses, deletedCount });
            } catch (error) {
                next(error);
            }
        }

    // [GET] /me/trash/courses
    async trashCourses(req, res, next) {
        try {
            let courses = await Course.findWithDeleted({ deleted: true })
            courses = multipleMongooseToObject(courses);
            res.render('me/trash-courses', { courses });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MeController();
