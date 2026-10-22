const zod = require("zod");

const EnrollmentSchema = zod.object({
    courseId: zod.number().int().positive("Course ID must be a positive integer")
});

module.exports = { EnrollmentSchema };