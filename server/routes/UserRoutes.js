const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

const { validate } = require('../middleware/validate');
const { authenticateToken } = require('../middleware/authMiddleware');
const { UpdateProfileSchema } = require('../validators/profileValidator');

// GET MY PROFILE
router.get(
    '/me',
    authenticateToken,
    UserController.getMyProfile
);

// UPDATE MY PROFILE
router.put(
    '/me',
    authenticateToken,
    validate(UpdateProfileSchema),
    UserController.updateMyProfile
);

// GET ALL USERS
// Protect this endpoint before deployment
router.get(
    '/',
    authenticateToken,
    UserController.getUsers
);

module.exports = router;