
const express = require("express");
const router = express.Router();

const lessonController = require("../controllers/lessonController");

const { validate } = require("../middleware/validate");
const { LessonSchema } = require("../validators/lessonValidator");

const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeInstructor } = require("../middleware/authorizeInstructor");

// GET COURSE LESSONS - AUTHORIZED USERS ONLY
router.get(
  "/course/:courseId",
  authenticateToken,
  lessonController.GetCourseLessonsForLearning
);

// CREATE LESSON - INSTRUCTOR ONLY
router.post(
  "/",
  authenticateToken,
  authorizeInstructor,
  validate(LessonSchema),
  lessonController.CreateLesson
);

// UPDATE LESSON - INSTRUCTOR OWNER ONLY
router.put(
  "/:lessonId",
  authenticateToken,
  authorizeInstructor,
  lessonController.UpdateLesson
);

// DELETE LESSON - INSTRUCTOR OWNER ONLY
router.delete(
  "/:lessonId",
  authenticateToken,
  authorizeInstructor,
  lessonController.DeleteLesson
);

module.exports = router;
