
const DataBasePool = require("../config/db");

function validId(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0;
}

// CREATE OR UPDATE LESSON PROGRESS
const createLessonProgress = async (req, res) => {
  const {
    lessonId,
    isCompleted = false,
    lastPositionSeconds = 0,
  } = req.body;

  const userId = req.user.userId;

  if (
    !validId(lessonId) ||
    typeof isCompleted !== "boolean" ||
    !Number.isSafeInteger(lastPositionSeconds) ||
    lastPositionSeconds < 0
  ) {
    return res.status(400).json({
      message: "Invalid lesson progress data",
    });
  }

  try {
    // Verify active enrollment and get lesson duration.
    const accessResult = await DataBasePool.query(
      `SELECT
         l.lessonid,
         l.durationseconds
       FROM lessons AS l
       INNER JOIN enrollments AS e
         ON e.courseid = l.courseid
       WHERE l.lessonid = $1
         AND e.userid = $2
         AND e.status IN ('active', 'completed')
       LIMIT 1`,
      [lessonId, userId]
    );

    if (accessResult.rows.length === 0) {
      return res.status(403).json({
        message:
          "Lesson not found or enrollment is not active",
      });
    }

    const lessonDuration = Number(
      accessResult.rows[0].durationseconds
    );

    if (
      Number.isFinite(lessonDuration) &&
      lessonDuration >= 0 &&
      lastPositionSeconds > lessonDuration
    ) {
      return res.status(400).json({
        message:
          "Video position exceeds the lesson duration",
      });
    }

    // Insert or update progress.
    // Once completed, a lesson remains completed.
    const result = await DataBasePool.query(
      `INSERT INTO lessonprogress
       (
         userid,
         lessonid,
         iscompleted,
         lastpositionseconds,
         completed_at
       )
       VALUES (
         $1, $2, $3, $4,
         CASE
           WHEN $3::boolean THEN CURRENT_TIMESTAMP
           ELSE NULL
         END
       )
       ON CONFLICT (userid, lessonid)
       DO UPDATE SET
         iscompleted =
           lessonprogress.iscompleted
           OR EXCLUDED.iscompleted,
         lastpositionseconds =
           EXCLUDED.lastpositionseconds,
         completed_at = CASE
           WHEN lessonprogress.iscompleted
             THEN lessonprogress.completed_at
           WHEN EXCLUDED.iscompleted
             THEN CURRENT_TIMESTAMP
           ELSE NULL
         END
       RETURNING
         userid,
         lessonid,
         iscompleted,
         lastpositionseconds,
         completed_at`,
      [
        userId,
        lessonId,
        isCompleted,
        lastPositionSeconds,
      ]
    );

    return res.status(200).json({
      message: "Lesson progress saved successfully",
      progress: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Error saving lesson progress:",
      error
    );

    return res.status(500).json({
      message: "Error saving lesson progress",
    });
  }
};

// GET CURRENT USER LESSON PROGRESS
const getLessonProgress = async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user.userId;

  if (!validId(lessonId)) {
    return res.status(400).json({
      message: "Invalid lesson ID",
    });
  }

  try {
    // Verify enrollment before exposing progress.
    const accessResult = await DataBasePool.query(
      `SELECT l.lessonid
       FROM lessons AS l
       INNER JOIN enrollments AS e
         ON e.courseid = l.courseid
       WHERE l.lessonid = $1
         AND e.userid = $2
         AND e.status IN ('active', 'completed')
       LIMIT 1`,
      [lessonId, userId]
    );

    if (accessResult.rows.length === 0) {
      return res.status(403).json({
        message: "Active enrollment required",
      });
    }

    const result = await DataBasePool.query(
      `SELECT
         lessonid,
         iscompleted,
         lastpositionseconds,
         completed_at
       FROM lessonprogress
       WHERE userid = $1
         AND lessonid = $2`,
      [userId, lessonId]
    );

    // No progress yet: return a valid initial state.
    if (result.rows.length === 0) {
      return res.status(200).json({
        lessonid: Number(lessonId),
        iscompleted: false,
        lastpositionseconds: 0,
        completed_at: null,
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(
      "Error fetching lesson progress:",
      error
    );

    return res.status(500).json({
      message: "Error fetching lesson progress",
    });
  }
};

// GET COURSE PROGRESS
const getCourseProgress = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.userId;

  if (!validId(courseId)) {
    return res.status(400).json({
      message: "Invalid course ID",
    });
  }

  try {
    const enrollmentResult = await DataBasePool.query(
      `SELECT enrollmentid
       FROM enrollments
       WHERE userid = $1
         AND courseid = $2
         AND status IN ('active', 'completed')
       LIMIT 1`,
      [userId, courseId]
    );

    if (enrollmentResult.rows.length === 0) {
      return res.status(403).json({
        message:
          "You do not have access to this course",
      });
    }

    const result = await DataBasePool.query(
      `SELECT
         COUNT(l.lessonid)::int AS total_lessons,
         COUNT(lp.lessonid) FILTER (
           WHERE lp.iscompleted = TRUE
         )::int AS completed_lessons
       FROM lessons AS l
       LEFT JOIN lessonprogress AS lp
         ON lp.lessonid = l.lessonid
         AND lp.userid = $1
       WHERE l.courseid = $2`,
      [userId, courseId]
    );

    const {
      total_lessons,
      completed_lessons,
    } = result.rows[0];

    const progressPercentage =
      total_lessons === 0
        ? 0
        : Math.round(
            (completed_lessons / total_lessons) * 100
          );

    return res.status(200).json({
      courseId: Number(courseId),
      totalLessons: total_lessons,
      completedLessons: completed_lessons,
      progressPercentage,
    });
  } catch (error) {
    console.error(
      "Error fetching course progress:",
      error
    );

    return res.status(500).json({
      message: "Error fetching course progress",
    });
  }
};

module.exports = {
  createLessonProgress,
  getLessonProgress,
  getCourseProgress,
};
