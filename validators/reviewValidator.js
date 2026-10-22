const zod = require('zod');

const ReviewSchema = zod.object({
    courseId: zod.number().int().positive(),
    rating: zod.number().int().min(1).max(5),
    comment: zod.string().trim().optional()
});

const UpdateReviewSchema = zod.object({
    rating: zod.number().int().min(1).max(5).optional(),
    comment: zod.string().trim().optional()
}).refine(
    (data) => data.rating !== undefined || data.comment !== undefined,
    { message: 'Provide rating or comment to update' }
);

module.exports = {
    ReviewSchema,
    UpdateReviewSchema
};