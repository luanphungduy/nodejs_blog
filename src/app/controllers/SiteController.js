const { multipleMongooseToObject } = require('../../utils/mongoose');
const Course = require('../models/Course');

class SiteController {
    // [GET] /
    async index(req, res, next) {
        try {
            let courses = await Course.find({});
            courses = multipleMongooseToObject(courses);
            res.render('home', { courses });
        } catch (error) {
            next(error);
        }
        // render home
    }

    // [GET] / search
    search(req, res) {
        res.render('search');
    }

    // [GET] / contact
    contact(req, res) {
        res.render('contact');
    }
}

module.exports = new SiteController();
