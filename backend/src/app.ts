import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import skillRoutes from './routes/skillRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import learningPathRoutes from './routes/learningPathRoutes';
import jobRoleRoutes from './routes/jobRoleRoutes';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const dbUrl = process.env.DATABASE_URL || '';
mongoose.connect(dbUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/job-roles', jobRoleRoutes);

app.get('/', (req, res) => {
    res.send('Career Planner API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
