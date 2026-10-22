
const express = require('express');
const router = express.Router();

const lessonController = require('../controllers/lessonController');

const { validate } = require('../middleware/validate');
const { LessonSchema } = require('../validators/lessonValidator');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeInstructor } = require('../middleware/authorizeInstructor');

// GET LESSONS
router.get('/', lessonController.GetLessons);

// CREATE LESSON
router.post(
    '/',
    authenticateToken,
    authorizeInstructor,
    validate(LessonSchema),
    lessonController.CreateLesson
);

// UPDATE LESSON
router.put(
    '/:lessonId',
    authenticateToken,
    authorizeInstructor,
    lessonController.UpdateLesson
);

// DELETE LESSON
router.delete(
    '/:lessonId',
    authenticateToken,
    authorizeInstructor,
    lessonController.DeleteLesson
);

module.exports = router;
