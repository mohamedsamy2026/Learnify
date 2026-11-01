
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const UserRoutes = require('./routes/UserRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const lessonProgressRoutes = require('./routes/lessonProgressRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Allowed frontend URLs
const allowedOrigins = [
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    process.env.FRONTEND_URL,
].filter(Boolean);
// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests without an Origin header
        // (Postman, server-to-server requests, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Learnify API is running',
    });
});

// API routes
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
