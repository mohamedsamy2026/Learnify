const zod = require("zod");

const CourseSchema = zod.object({
    Coursename: zod.string().min(1, "Course name is required"),
    description: zod.string().optional(),
    thumbnail_URL: zod.url().optional(),
    Level: zod.enum(["beginner", "intermediate", "advanced"]),
    CoursePrice: zod.number().min(0, "Price cannot be negative"),
    Category: zod.string().optional()
});

const UpdateCourseSchema = CourseSchema.partial();

module.exports = {
    CourseSchema,
    UpdateCourseSchema
};

