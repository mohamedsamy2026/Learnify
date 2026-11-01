const express = require('express');
const router = express.Router();

const lessonProgressController = require('../controllers/lessonProgressController');
const { validate } = require('../middleware/validate');
const { LessonProgressSchema } = require('../validators/lessonProgressValidator');
const { authenticateToken } = require('../middleware/authMiddleware');

// CREATE OR UPDATE LESSON PROGRESS
router.post(
    '/',
    authenticateToken,
    validate(LessonProgressSchema),
    lessonProgressController.createLessonProgress
);

// GET COURSE PROGRESS
router.get(
    '/course/:courseId',
    authenticateToken,
    lessonProgressController.getCourseProgress
);

// GET LESSON PROGRESS
router.get(
    '/:lessonId',
    authenticateToken,
    lessonProgressController.getLessonProgress
);

module.exports = router;