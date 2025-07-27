"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testResumeRoute = exports.deleteResume = exports.updateResume = exports.createResume = exports.getResumeByUser = exports.getResumeById = exports.getResumes = void 0;
const Resume_1 = __importDefault(require("../models/Resume"));
// Get all resumes (admin or for testing)
const getResumes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resumes = yield Resume_1.default.find().populate('user');
        res.json(resumes);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getResumes = getResumes;
// Get resume by ID
const getResumeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resume = yield Resume_1.default.findById(req.params.id).populate('user');
        if (!resume)
            return res.status(404).json({ message: 'Resume not found' });
        res.json(resume);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getResumeById = getResumeById;
// Get resume by user
const getResumeByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Validate user ID format
        if (!userId || userId.length !== 24) {
            return res.status(400).json({
                message: 'Invalid user ID format',
                userId: userId
            });
        }
        console.log(`Fetching resumes for user: ${userId}`);
        let resumes = yield Resume_1.default.find({ user: userId }).populate('user');
        console.log(`Found ${resumes.length} resumes for user ${userId}`);
        // If no resumes exist, create a sample resume for testing
        if (resumes.length === 0) {
            console.log('No resumes found, creating sample resume for testing');
            const sampleResume = yield Resume_1.default.create({
                user: userId,
                content: {
                    personalInfo: {
                        name: 'Sample User',
                        email: 'sample@example.com',
                        phone: '+1-234-567-8900',
                        location: 'City, State'
                    },
                    summary: 'Experienced professional with expertise in multiple domains.',
                    experience: [
                        {
                            title: 'Sample Position',
                            company: 'Sample Company',
                            duration: '2020 - Present',
                            description: 'Sample job description and responsibilities.'
                        }
                    ],
                    education: [
                        {
                            degree: 'Bachelor\'s Degree',
                            institution: 'Sample University',
                            year: '2020'
                        }
                    ],
                    skills: ['Sample Skill 1', 'Sample Skill 2', 'Sample Skill 3']
                }
            });
            resumes = [sampleResume];
            console.log('Sample resume created successfully');
        }
        res.json(resumes || []);
    }
    catch (err) {
        console.error('Error fetching resumes by user:', err);
        res.status(500).json({
            message: 'Server error',
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
});
exports.getResumeByUser = getResumeByUser;
// Create a new resume
const createResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, content } = req.body;
        const resume = yield Resume_1.default.create({ user, content });
        res.status(201).json(resume);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.createResume = createResume;
// Update a resume
const updateResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const resume = yield Resume_1.default.findByIdAndUpdate(req.params.id, { content }, { new: true });
        if (!resume)
            return res.status(404).json({ message: 'Resume not found' });
        res.json(resume);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.updateResume = updateResume;
// Delete a resume
const deleteResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resume = yield Resume_1.default.findByIdAndDelete(req.params.id);
        if (!resume)
            return res.status(404).json({ message: 'Resume not found' });
        res.json({ message: 'Resume deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.deleteResume = deleteResume;
// Test endpoint to check if resume routes are working
const testResumeRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            message: 'Resume routes are working',
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.testResumeRoute = testResumeRoute;
