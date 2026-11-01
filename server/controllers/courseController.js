
const DataBasePool = require('../config/db');

// GET ALL COURSES
const GetCourses = async (req, res) => {
    try {
        const result = await DataBasePool.query(
            'SELECT * FROM courses ORDER BY courseid DESC'
        );

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);

        return res.status(500).json({
            message: 'Error fetching courses'
        });
    }
};

// GET COURSE BY ID
const GetCourseById = async (req, res) => {
    const courseId = req.params.id;

    if (!/^[1-9]\d*$/.test(String(courseId))) {
        return res.status(400).json({
            message: 'Invalid course ID'
        });
    }

    try {
        const result = await DataBasePool.query(
            'SELECT * FROM courses WHERE courseid = $1',
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

// CREATE COURSE - INSTRUCTOR ONLY
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
             (coursename, description, thumbnail_url, level,
              courseprice, category, instructorid)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                Coursename,
                description ?? null,
                thumbnail_URL ?? null,
                Level,
                CoursePrice,
                Category ?? null,
                instructorId
            ]
        );

        return res.status(201).json({
            message: 'Course created successfully',
            course: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating course:', error);

        if (error.code === '23503') {
            return res.status(400).json({
                message: 'Instructor does not exist'
            });
        }

        return res.status(500).json({
            message: 'Error creating course'
        });
    }
};

// UPDATE COURSE - OWNER ONLY
const UpdateCourse = async (req, res) => {
    const courseId = req.params.id;
    const instructorId = req.user.userId;

    if (!/^[1-9]\d*$/.test(String(courseId))) {
        return res.status(400).json({
            message: 'Invalid course ID'
        });
    }

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
            `UPDATE courses
             SET
                coursename = COALESCE($1, coursename),
                description = COALESCE($2, description),
                thumbnail_url = COALESCE($3, thumbnail_url),
                level = COALESCE($4, level),
                courseprice = COALESCE($5, courseprice),
                category = COALESCE($6, category)
             WHERE courseid = $7
               AND instructorid = $8
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

// DELETE COURSE - OWNER ONLY
const DeleteCourse = async (req, res) => {
    const courseId = req.params.id;
    const instructorId = req.user.userId;

    if (!/^[1-9]\d*$/.test(String(courseId))) {
        return res.status(400).json({
            message: 'Invalid course ID'
        });
    }

    try {
        const result = await DataBasePool.query(
            `DELETE FROM courses
             WHERE courseid = $1
               AND instructorid = $2
             RETURNING courseid`,
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
                message: 'Cannot delete a course with related lessons, enrollments or reviews'
            });
        }

        console.error('Error deleting course:', error);

        return res.status(500).json({
            message: 'Error deleting course'
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
