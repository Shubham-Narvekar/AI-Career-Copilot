"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const skillRoutes_1 = __importDefault(require("./routes/skillRoutes"));
const assessmentRoutes_1 = __importDefault(require("./routes/assessmentRoutes"));
const learningPathRoutes_1 = __importDefault(require("./routes/learningPathRoutes"));
const resumeRoutes_1 = __importDefault(require("./routes/resumeRoutes"));
const jobRoleRoutes_1 = __importDefault(require("./routes/jobRoleRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
const dbUrl = process.env.DATABASE_URL || '';
mongoose_1.default.connect(dbUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/skills', skillRoutes_1.default);
app.use('/api/assessments', assessmentRoutes_1.default);
app.use('/api/learning-paths', learningPathRoutes_1.default);
app.use('/api/resumes', resumeRoutes_1.default);
app.use('/api/job-roles', jobRoleRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Career Planner API is running');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
