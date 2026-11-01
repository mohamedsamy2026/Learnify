const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');

const { validate } = require('../middleware/validate');
const {
    ReviewSchema,
    UpdateReviewSchema
} = require('../validators/reviewValidator');

const { authenticateToken } = require('../middleware/authMiddleware');

// GET REVIEWS
router.get(
    '/course/:courseId',
    reviewController.getReviewsByCourse
);

// CREATE REVIEW
router.post(
    '/',
    authenticateToken,
    validate(ReviewSchema),
    reviewController.createReview
);

// UPDATE REVIEW
router.put(
    '/:reviewId',
    authenticateToken,
    validate(UpdateReviewSchema),
    reviewController.updateReview
);

// DELETE REVIEW
router.delete(
    '/:reviewId',
    authenticateToken,
    reviewController.deleteReview
);

module.exports = router;