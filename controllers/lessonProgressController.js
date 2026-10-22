
const DataBasePool = require('../config/db');

// CREATE OR UPDATE LESSON PROGRESS
const createLessonProgress = async (req, res) => {
    const { lessonId, isCompleted, lastPositionSeconds } = req.body;
    const userId = req.user.userId;

    try {
        // Check lesson and course enrollment
        const accessResult = await DataBasePool.query(
            `SELECT l.LessonId
             FROM Lessons l
             JOIN Enrollments e ON e.CourseId = l.CourseId
             WHERE l.LessonId = $1
               AND e.UserId = $2
               AND e.Status IN ('active', 'completed')`,
            [lessonId, userId]
        );

        if (accessResult.rows.length === 0) {
            return res.status(403).json({
                message: 'Lesson not found or enrollment is not active'
            });
        }

        // Insert new progress or update existing progress
        const result = await DataBasePool.query(
            `INSERT INTO LessonProgress
             (UserId, LessonId, IsCompleted, LastPositionSeconds, completed_at)
             VALUES ($1, $2, $3, $4,
                     CASE WHEN $3::boolean THEN CURRENT_TIMESTAMP ELSE NULL END)
             ON CONFLICT (UserId, LessonId)
             DO UPDATE SET
                 IsCompleted = LessonProgress.IsCompleted OR EXCLUDED.IsCompleted,
                 LastPositionSeconds = EXCLUDED.LastPositionSeconds,
                 completed_at = CASE
                     WHEN LessonProgress.IsCompleted THEN LessonProgress.completed_at
                     WHEN EXCLUDED.IsCompleted THEN CURRENT_TIMESTAMP
                     ELSE NULL
                 END
             RETURNING *`,
            [
                userId,
                lessonId,
                isCompleted ?? false,
                lastPositionSeconds ?? 0
            ]
        );

        return res.status(200).json({
            message: 'Lesson progress saved successfully',
            progress: result.rows[0]
        });

    } catch (error) {
        console.error('Error saving lesson progress:', error);

        return res.status(500).json({
            message: 'Error saving lesson progress'
        });
    }
};

// GET LESSON PROGRESS FOR CURRENT USER
const getLessonProgress = async (req, res) => {
    const { lessonId } = req.params;
    const userId = req.user.userId;

    try {
        const result = await DataBasePool.query(
            `SELECT *
             FROM LessonProgress
             WHERE UserId = $1 AND LessonId = $2`,
            [userId, lessonId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Lesson progress not found'
            });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error fetching lesson progress:', error);

        return res.status(500).json({
            message: 'Error fetching lesson progress'
        });
    }
};

const getCourseProgress = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.userId;

    if (!/^[1-9]\d*$/.test(courseId)) {
        return res.status(400).json({
            message: 'Invalid course ID'
        });
    }

    try {
        // Check enrollment
        const enrollment = await DataBasePool.query(
            `SELECT EnrollmentId
             FROM Enrollments
             WHERE UserId = $1
               AND CourseId = $2
               AND Status IN ('active', 'completed')`,
            [userId, courseId]
        );

        if (enrollment.rows.length === 0) {
            return res.status(403).json({
                message: 'You do not have access to this course'
            });
        }

        // Calculate completed and total lessons
        const result = await DataBasePool.query(
            `SELECT
                COUNT(l.LessonId)::int AS total_lessons,
                COUNT(lp.LessonId) FILTER (
                    WHERE lp.IsCompleted = TRUE
                )::int AS completed_lessons
             FROM Lessons l
             LEFT JOIN LessonProgress lp
               ON lp.LessonId = l.LessonId
              AND lp.UserId = $1
             WHERE l.CourseId = $2`,
            [userId, courseId]
        );

        const { total_lessons, completed_lessons } = result.rows[0];

        const progressPercentage = total_lessons === 0
            ? 0
            : Math.round((completed_lessons / total_lessons) * 100);

        return res.status(200).json({
            courseId: Number(courseId),
            totalLessons: total_lessons,
            completedLessons: completed_lessons,
            progressPercentage
        });

    } catch (error) {
        console.error('Error fetching course progress:', error);

        return res.status(500).json({
            message: 'Error fetching course progress'
        });
    }
};


module.exports = {
    createLessonProgress,
    getLessonProgress,
    getCourseProgress
};