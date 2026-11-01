const authorizeInstructor = (req, res, next) => {
    if (req.user.role !== 'instructor') {
        return res.status(403).json({ message: 'Access denied. Instructors only.' });
    }
    next();
};

module.exports = { authorizeInstructor };