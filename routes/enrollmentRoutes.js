const express = require('express');
const router = express.Router();

const enrollmentController = require('../controllers/enrollmentController');
const { validate } = require('../middleware/validate');
const { EnrollmentSchema } = require('../validators/enrollmentValidator');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post(
    '/',
    authenticateToken,
    validate(EnrollmentSchema),
    enrollmentController.enrollInCourse 
);

router.get(
    '/my-courses',
    authenticateToken,
    enrollmentController.getMyCourses
);

module.exports = router;