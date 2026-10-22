
const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/courseController');

const { validate } = require('../middleware/validate');

const {
    CourseSchema,
    UpdateCourseSchema
} = require('../validators/courseValidator');

const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeInstructor } = require('../middleware/authorizeInstructor');

// GET ALL COURSES
router.get('/', coursesController.GetCourses);

// GET COURSE BY ID
router.get('/:id', coursesController.GetCourseById);

// CREATE COURSE
router.post(
    '/',
    authenticateToken,
    authorizeInstructor,
    validate(CourseSchema),
    coursesController.CreateCourse
);

// UPDATE COURSE
router.put(
    '/:id',
    authenticateToken,
    authorizeInstructor,
    validate(UpdateCourseSchema),
    coursesController.UpdateCourse
);

// DELETE COURSE
router.delete(
    '/:id',
    authenticateToken,
    authorizeInstructor,
    coursesController.DeleteCourse
);

module.exports = router;
