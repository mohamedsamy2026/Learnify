
const DataBasePool = require('../config/db');

// GET ALL COURSES
const GetCourses = async (req, res) => {
    try {
        const result = await DataBasePool.query(
            'SELECT * FROM courses ORDER BY created_at DESC'
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);

        res.status(500).json({
            message: 'Error fetching courses'
        });
    }
};

// CREATE COURSE
const CreateCourse = async (req, res) => {
    const {
        Coursename,
        description,
        thumbnail_URL,
        Level,
        CoursePrice,
        Category
    } = req.body;

    const instructorId = req.user.userId;

    try {
        const result = await DataBasePool.query(
            `INSERT INTO courses
             (Coursename, Description, thumbnail_URL, Level, CoursePrice, Category, InstructorId)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                Coursename,
                description,
                thumbnail_URL,
                Level,
                CoursePrice,
                Category,
                instructorId
            ]
        );

        return res.status(201).json({
            message: 'Course created successfully',
            course: result.rows[0]
        });

    } catch (error) {
        console.error('Error creating course:', error);

        return res.status(500).json({
            message: 'Error creating course'
        });
    }
};

// DELETE COURSE
const DeleteCourse = async (req, res) => {
    const courseId = req.params.id;
    const instructorId = req.user.userId;

    try {
        const result = await DataBasePool.query(
            `DELETE FROM courses
             WHERE CourseId = $1 AND InstructorId = $2
             RETURNING CourseId`,
            [courseId, instructorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Course not found or access denied'
            });
        }

        return res.status(200).json({
            message: 'Course deleted successfully'
        });

    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({
                message: 'Cannot delete a course with related lessons or enrollments'
            });
        }

        console.error('Error deleting course:', error);

        return res.status(500).json({
            message: 'Error deleting course'
        });
    }
};

// GET COURSE BY ID
const GetCourseById = async (req, res) => {
    const courseId = req.params.id;

    try {
        const result = await DataBasePool.query(
            `SELECT * FROM Courses
             WHERE CourseId = $1`,
            [courseId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error fetching course:', error);

        return res.status(500).json({
            message: 'Error fetching course'
        });
    }
};

// UPDATE COURSE
const UpdateCourse = async (req, res) => {
    const courseId = req.params.id;
    const instructorId = req.user.userId;

    const {
        Coursename,
        description,
        thumbnail_URL,
        Level,
        CoursePrice,
        Category
    } = req.body;

    try {
        const result = await DataBasePool.query(
            `UPDATE Courses
             SET
                Coursename = COALESCE($1, Coursename),
                Description = COALESCE($2, Description),
                thumbnail_URL = COALESCE($3, thumbnail_URL),
                Level = COALESCE($4, Level),
                CoursePrice = COALESCE($5, CoursePrice),
                Category = COALESCE($6, Category)
             WHERE CourseId = $7
             AND InstructorId = $8
             RETURNING *`,
            [
                Coursename ?? null,
                description ?? null,
                thumbnail_URL ?? null,
                Level ?? null,
                CoursePrice ?? null,
                Category ?? null,
                courseId,
                instructorId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Course not found or access denied'
            });
        }

        return res.status(200).json({
            message: 'Course updated successfully',
            course: result.rows[0]
        });

    } catch (error) {
        console.error('Error updating course:', error);

        return res.status(500).json({
            message: 'Error updating course'
        });
    }
};

module.exports = {
    GetCourses,
    GetCourseById,
    CreateCourse,
    UpdateCourse,
    DeleteCourse
};
