
require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const UserRoutes = require('./routes/UserRoutes');
const app = express();
const port = process.env.PORT || 3000;
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const lessonProgressRoutes = require('./routes/lessonProgressRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/users', UserRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/lesson-progress', lessonProgressRoutes);
app.use('/api/reviews', reviewRoutes);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});