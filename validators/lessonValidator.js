
const zod = require("zod");

const LessonSchema = zod.object({
    lessonName: zod.string().trim().min(1, "Lesson name is required"),
    description: zod.string().optional(),
    videoURL: zod.url("Invalid video URL").optional(),
    durationSeconds: zod.number().int().min(0, "Duration cannot be negative"),
    lessonOrder: zod.number().int().min(1, "Lesson order must be at least 1"),
    courseId: zod.number().int().positive("Course ID must be positive")
});

module.exports = { LessonSchema };
