
const DataBasePool = require('../config/db');

// 1. CREATE REVIEW
const createReview = async (req, res) => {
    const { courseId, rating, comment } = req.body;
    const userId = req.user.userId;

    try {
        // Check if the course exists
        const courseResult = await DataBasePool.query(
            'SELECT CourseId FROM Courses WHERE CourseId = $1',
            [courseId]
        );

        if (courseResult.rows.length === 0) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        // Check if the user is enrolled
        const enrollmentResult = await DataBasePool.query(
            `SELECT EnrollmentId FROM Enrollments
             WHERE UserId = $1
             AND CourseId = $2
             AND Status IN ('active', 'completed')`,
            [userId, courseId]
        );

        if (enrollmentResult.rows.length === 0) {
            return res.status(403).json({
                message: 'You must be enrolled in this course to review it'
            });
        }

        // Create review
        const result = await DataBasePool.query(
            `INSERT INTO Reviews (UserId, CourseId, Rating, Comment)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, courseId, rating, comment ?? null]
        );

        return res.status(201).json({
            message: 'Review created successfully',
            review: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                message: 'You have already reviewed this course'
            });
        }

        console.error('Error creating review:', error);

        return res.status(500).json({
            message: 'Error creating review'
        });
    }
};


// 2. GET REVIEWS BY COURSE
const getReviewsByCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const courseResult = await DataBasePool.query(
            'SELECT CourseId FROM Courses WHERE CourseId = $1',
            [courseId]
        );

        if (courseResult.rows.length === 0) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        const result = await DataBasePool.query(
            `SELECT
                r.ReviewId,
                r.CourseId,
                r.UserId,
                u.name AS userName,
                r.Rating,
                r.Comment,
                r.created_at
             FROM Reviews r
             JOIN Users u ON r.UserId = u.UserId
             WHERE r.CourseId = $1
             ORDER BY r.created_at DESC`,
            [courseId]
        );

        return res.status(200).json({
            reviews: result.rows
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);

        return res.status(500).json({
            message: 'Error fetching reviews'
        });
    }
};


const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    try {
        const result = await DataBasePool.query(
            `UPDATE Reviews
             SET
                Rating = COALESCE($1, Rating),
                Comment = COALESCE($2, Comment)
             WHERE ReviewId = $3
               AND UserId = $4
             RETURNING *`,
            [
                rating ?? null,
                comment ?? null,
                reviewId,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Review not found or access denied'
            });
        }

        return res.status(200).json({
            message: 'Review updated successfully',
            review: result.rows[0]
        });

    } catch (error) {
        console.error('Error updating review:', error);

        return res.status(500).json({
            message: 'Error updating review'
        });
    }
};

// 4. DELETE REVIEW
const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    try {
        const result = await DataBasePool.query(
            `DELETE FROM Reviews
             WHERE ReviewId = $1
             AND UserId = $2
             RETURNING ReviewId`,
            [reviewId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Review not found or you are not authorized'
            });
        }

        return res.status(200).json({
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting review:', error);

        return res.status(500).json({
            message: 'Error deleting review'
        });
    }
};


// EXPORT CONTROLLERS
module.exports = {
    createReview,
    getReviewsByCourse,
    updateReview,
    deleteReview
};
