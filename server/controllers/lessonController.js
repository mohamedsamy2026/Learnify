
const DataBasePool = require('../config/db');

// GET ALL LESSONS
const GetLessons = async (req, res) => {
    try {
        const result = await DataBasePool.query(
            `SELECT * FROM lessons
             ORDER BY CourseId, LessonOrder`
        );

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return res.status(500).json({
            message: 'Error fetching lessons'
        });
    }
};

// CREATE LESSON
const CreateLesson = async (req, res) => {
    const {
        lessonName,
        description,
        videoURL,
        courseId,
        durationSeconds,
        lessonOrder
    } = req.body;

    const instructorId = req.user.userId;

    try {
        // Check course ownership
        const course = await DataBasePool.query(
            `SELECT CourseId FROM courses
             WHERE CourseId = $1 AND InstructorId = $2`,
            [courseId, instructorId]
        );

        if (course.rows.length === 0) {
            return res.status(403).json({
                message: 'Course not found or you are not its instructor'
            });
        }

        const result = await DataBasePool.query(
            `INSERT INTO lessons
             (CourseId, LessonName, Description, Video_URL,
              DurationSeconds, LessonOrder)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                courseId,
                lessonName,
                description,
                videoURL,
                durationSeconds,
                lessonOrder
            ]
        );

        return res.status(201).json({
            message: 'Lesson created successfully',
            lesson: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                message: 'Lesson order already exists in this course'
            });
        }

        console.error('Error creating lesson:', error);
        return res.status(500).json({
            message: 'Error creating lesson'
        });
    }
};

// UPDATE LESSON
const UpdateLesson = async (req, res) => {
    const { lessonId } = req.params;
    const {
        lessonName,
        description,
        videoURL,
        durationSeconds,
        lessonOrder
    } = req.body;

    const instructorId = req.user.userId;

    try {
        const result = await DataBasePool.query(
            `UPDATE lessons AS l
             SET LessonName = $1,
                 Description = $2,
                 Video_URL = $3,
                 DurationSeconds = $4,
                 LessonOrder = $5
             FROM courses AS c
             WHERE l.CourseId = c.CourseId
               AND l.LessonId = $6
               AND c.InstructorId = $7
             RETURNING l.*`,
            [
                lessonName,
                description,
                videoURL,
                durationSeconds,
                lessonOrder,
                lessonId,
                instructorId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Lesson not found or access denied'
            });
        }

        return res.status(200).json({
            message: 'Lesson updated successfully',
            lesson: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                message: 'Lesson order already exists in this course'
            });
        }

        console.error('Error updating lesson:', error);
        return res.status(500).json({
            message: 'Error updating lesson'
        });
    }
};

// DELETE LESSON
const DeleteLesson = async (req, res) => {
    const { lessonId } = req.params;
    const instructorId = req.user.userId;

    try {
        const result = await DataBasePool.query(
            `DELETE FROM lessons AS l
             USING courses AS c
             WHERE l.CourseId = c.CourseId
               AND l.LessonId = $1
               AND c.InstructorId = $2
             RETURNING l.LessonId`,
            [lessonId, instructorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Lesson not found or access denied'
            });
        }

        return res.status(200).json({
            message: 'Lesson deleted successfully'
        });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({
                message: 'Cannot delete a lesson with existing progress records'
            });
        }

        console.error('Error deleting lesson:', error);
        return res.status(500).json({
            message: 'Error deleting lesson'
        });
    }
};

const GetCourseLessonsForLearning = async (req, res) => {
  const courseId = Number(req.params.courseId);
  const userId = req.user.userId;

  if (!Number.isSafeInteger(courseId) || courseId <= 0) {
    return res.status(400).json({
      message: "Invalid course ID",
    });
  }

  try {
    const courseResult = await DataBasePool.query(
      `SELECT courseid, instructorid, coursename
       FROM courses
       WHERE courseid = $1`,
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const course = courseResult.rows[0];

    const isOwner =
      String(course.instructorid) === String(userId);

    if (!isOwner) {
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
          message: "Active enrollment required",
        });
      }
    }

    const lessonsResult = await DataBasePool.query(
      `SELECT
         lessonid,
         courseid,
         lessonname,
         description,
         video_url,
         durationseconds,
         lessonorder
       FROM lessons
       WHERE courseid = $1
       ORDER BY lessonorder ASC, lessonid ASC`,
      [courseId]
    );

    return res.status(200).json({
      course,
      lessons: lessonsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching course lessons:", error);

    return res.status(500).json({
      message: "Error fetching course lessons",
    });
  }
};

module.exports = {
  GetLessons,
  CreateLesson,
  UpdateLesson,
  DeleteLesson,
  GetCourseLessonsForLearning,
};
