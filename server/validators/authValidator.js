const zod = require("zod");

const authSchema = zod.object({
  name: zod.string().min(1, "Name is required"),
  email: zod.email("Invalid email address"),
  password: zod.string().min(8, "Password must be at least 8 characters long"),
});
const loginSchema = zod.object({
  email: zod.email("Invalid email address"),
  password: zod.string().min(1, "Password is required")
});
module.exports = {
  authSchema,
  loginSchema
};