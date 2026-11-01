const zod = require('zod');

const UpdateProfileSchema = zod.object({
    name: zod.string().trim().min(1).optional(),
    email: zod.email().optional()
}).refine(
    (data) => data.name !== undefined || data.email !== undefined,
    { message: 'Provide name or email to update' }
);

module.exports = { UpdateProfileSchema };