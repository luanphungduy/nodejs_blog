const { mongooseToOject } = require('../../utils/mongoose');
const Course = require('../models/Course');

class CoursesController {
    // [GET] /courses/:slug
    async show(req, res, next) {
        try {
            let course = await Course.findOne({ slug: req.params.slug });
            course = mongooseToOject(course);
            res.render('courses/show', { course });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /courses/create
    create(req, res, next) {
        res.render('courses/create');
    }

    // [POST] /courses/store
    async store(req, res, next) {
        req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        try {
            let course = await Course.findOne().sort({ _id: 'desc' });
            req.body._id = course === null ? 1 : course._id + 1;
            const formData = req.body;
            course = new Course(formData);
            await course.save();
            res.redirect('/me/stored/courses');
        } catch (error) {
            next(error);
        }
    }

    // [GET] /courses/:id/edit
    async edit(req, res, next) {
        try {
            let course = await Course.findById(req.params.id);
            course = mongooseToOject(course);
            res.render('courses/edit', { course });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /courses/:id/
    async update(req, res, next) {
        try {
            await Course.updateOne({ _id: req.params.id }, req.body);
            res.redirect('/me/stored/courses');
        } catch (error) {
            next(error);
        }
    }

    // [PATCH] /courses/:id/restore
    async restore(req, res, next) {
        try {
            await Course.restore({ _id: req.params.id });
            res.redirect('back');
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /courses/:id/
    async destroy(req, res, next) {
        try {
            await Course.delete({ _id: req.params.id });
            res.redirect('back');
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /courses/:id/force
    async forceDestroy(req, res, next) {
        try {
            await Course.deleteOne({ _id: req.params.id });
            res.redirect('back');
        } catch (error) {
            next(error);
        }
    }

    // [POST] /courses/handle-form-actions
    async handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                try {
                    await Course.delete({ _id: { $in: req.body.courseIds } });
                    res.redirect('back');
                } catch (error) {
                    next(error);
                }
                break;
            case 'restore':
                try {
                    await Course.restore({ _id: { $in: req.body.courseIds } });
                    res.redirect('back');
                } catch (error) {
                    next(error);
                }
                break;
            case 'permanent-delete':
                try {
                    await Course.deleteMany({ _id: { $in: req.body.courseIds } });
                    res.redirect('back');
                } catch (error) {
                    next(error);
                }
                break;
            default:
                res.json({ message: 'Action invalid' });
        }
    }

    
}

module.exports = new CoursesController();
