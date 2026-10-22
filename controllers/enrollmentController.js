
const DataBasePool = require('../config/db');

const enrollInCourse = async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user.userId;

    try {
        // Check if course exists and get its price
        const courseResult = await DataBasePool.query(
            'SELECT CoursePrice FROM Courses WHERE CourseId = $1',
            [courseId]
        );

        if (courseResult.rows.length === 0) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        const coursePrice = Number(courseResult.rows[0].courseprice);

        // Determine enrollment status
        const status = coursePrice === 0 ? 'active' : 'pending';

        // Create enrollment
        const result = await DataBasePool.query(
            `INSERT INTO Enrollments (UserId, CourseId, Status)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, courseId, status]
        );

        return res.status(201).json({
            message: 'Enrolled successfully',
            enrollment: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                message: 'You are already enrolled in this course'
            });
        }

        console.error('Error enrolling in course:', error);

        return res.status(500).json({
            message: 'Error enrolling in course'
        });
    }
};

const getMyCourses = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await DataBasePool.query(
            `SELECT
                c.CourseId,
                c.Coursename,
                c.Description,
                c.thumbnail_URL,
                c.CoursePrice,
                c.Category,
                c.Level,
                e.EnrollmentId,
                e.Status,
                e.enrolled_at
             FROM Enrollments e
             JOIN Courses c ON e.CourseId = c.CourseId
             WHERE e.UserId = $1
             ORDER BY e.enrolled_at DESC`,
            [userId]
        );

        return res.status(200).json({
            courses: result.rows
        });

    } catch (error) {
        console.error('Error fetching my courses:', error);

        return res.status(500).json({
            message: 'Error fetching enrolled courses'
        });
    }
};


module.exports = {
    enrollInCourse,
    getMyCourses
};
