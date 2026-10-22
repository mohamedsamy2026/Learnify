const express = require('express');
const router = express.Router();

const { validate } = require('../middleware/validate');
const { authSchema, loginSchema } = require('../validators/authValidator');
const authController = require('../controllers/authController');

router.post('/register', validate(authSchema), authController.registerUser);

router.post('/login', validate(loginSchema), authController.LoginUser);

module.exports = router;