const zod = require("zod");

const LessonProgressSchema = zod.object({
    lessonId: zod.number().int().positive("Lesson ID must be positive"),

    isCompleted: zod.boolean().optional(),

    lastPositionSeconds: zod.number()
        .int()
        .min(0, "Last position cannot be negative")
        .optional()
});

module.exports = { LessonProgressSchema };