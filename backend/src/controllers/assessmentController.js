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
exports.testGeminiAPI = exports.generateLearningPath = exports.generateRecommendations = exports.generateQuestions = exports.getResultsByUser = exports.submitResult = exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestionById = exports.getQuestions = void 0;
const AssessmentQuestion_1 = __importDefault(require("../models/AssessmentQuestion"));
const AssessmentResult_1 = __importDefault(require("../models/AssessmentResult"));
const geminiService_1 = __importDefault(require("../services/geminiService"));
// --- Assessment Questions ---
// Get all questions
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield AssessmentQuestion_1.default.find().populate('skill');
        res.json(questions);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getQuestions = getQuestions;
// Get question by ID
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield AssessmentQuestion_1.default.findById(req.params.id).populate('skill');
        if (!question)
            return res.status(404).json({ message: 'Question not found' });
        res.json(question);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getQuestionById = getQuestionById;
// Create a new question
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionText, options, correctAnswer, skill } = req.body;
        const question = yield AssessmentQuestion_1.default.create({ questionText, options, correctAnswer, skill });
        res.status(201).json(question);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.createQuestion = createQuestion;
// Update a question
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionText, options, correctAnswer, skill } = req.body;
        const question = yield AssessmentQuestion_1.default.findByIdAndUpdate(req.params.id, { questionText, options, correctAnswer, skill }, { new: true });
        if (!question)
            return res.status(404).json({ message: 'Question not found' });
        res.json(question);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.updateQuestion = updateQuestion;
// Delete a question
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield AssessmentQuestion_1.default.findByIdAndDelete(req.params.id);
        if (!question)
            return res.status(404).json({ message: 'Question not found' });
        res.json({ message: 'Question deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.deleteQuestion = deleteQuestion;
// --- Assessment Results ---
// Submit assessment result
const submitResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, answers, score } = req.body;
        const result = yield AssessmentResult_1.default.create({ user, answers, score });
        res.status(201).json(result);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.submitResult = submitResult;
// Get results for a user
const getResultsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield AssessmentResult_1.default.find({ user: req.params.userId })
            .populate('user')
            .populate('answers.question');
        res.json(results);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getResultsByUser = getResultsByUser;
// --- Gemini-powered Assessment Generation ---
// Generate questions using Gemini AI
const generateQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skill, category, count = 5, difficulty = 'intermediate' } = req.body;
        if (!skill || !category) {
            return res.status(400).json({ message: 'Skill and category are required' });
        }
        console.log(`Generating questions for: ${skill} (${category}) at ${difficulty} level`);
        console.log(`Gemini API Key available: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO'}`);
        // Check if Gemini API key is available
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not found, using fallback questions');
            // Return fallback questions when API key is not available
            const fallbackQuestions = generateFallbackQuestions(skill, category, count, difficulty);
            return res.json({
                success: true,
                questions: fallbackQuestions,
                metadata: {
                    skill,
                    category,
                    count,
                    difficulty,
                    generatedAt: new Date().toISOString(),
                    note: 'Using fallback questions (Gemini API key not configured)',
                    aiStatus: 'FALLBACK'
                }
            });
        }
        console.log('Attempting to generate questions with Gemini AI...');
        const questions = yield geminiService_1.default.generateAssessmentQuestions(skill, category, count, difficulty);
        console.log(`Successfully generated ${questions.length} AI questions for ${skill}`);
        res.json({
            success: true,
            questions,
            metadata: {
                skill,
                category,
                count,
                difficulty,
                generatedAt: new Date().toISOString(),
                aiStatus: 'AI_GENERATED'
            }
        });
    }
    catch (error) {
        console.error('Error generating questions with Gemini AI:', error);
        // If Gemini fails, try fallback questions
        try {
            const { skill, category, count = 5, difficulty = 'intermediate' } = req.body;
            console.log('Falling back to pre-generated questions due to AI error');
            const fallbackQuestions = generateFallbackQuestions(skill, category, count, difficulty);
            return res.json({
                success: true,
                questions: fallbackQuestions,
                metadata: {
                    skill,
                    category,
                    count,
                    difficulty,
                    generatedAt: new Date().toISOString(),
                    note: 'Using fallback questions due to API error',
                    aiStatus: 'FALLBACK_ERROR',
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            });
        }
        catch (fallbackError) {
            res.status(500).json({
                message: 'Failed to generate questions',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
});
exports.generateQuestions = generateQuestions;
// Fallback question generator
const generateFallbackQuestions = (skill, category, count, difficulty) => {
    const skillSpecificQuestions = {
        'Programming': [
            {
                questionText: `What is the primary use case for ${skill}?`,
                options: [
                    `Building web applications and software`,
                    `Creating graphic designs`,
                    `Managing databases`,
                    `Writing documentation`
                ],
                correctAnswer: `Building web applications and software`,
                explanation: `${skill} is primarily used for building web applications and software development.`,
                difficulty: difficulty
            },
            {
                questionText: `Which of the following is a best practice when working with ${skill}?`,
                options: [
                    `Writing clean, readable code`,
                    `Using complex syntax always`,
                    `Ignoring error handling`,
                    `Avoiding documentation`
                ],
                correctAnswer: `Writing clean, readable code`,
                explanation: `Writing clean, readable code is a fundamental best practice in ${skill} development.`,
                difficulty: difficulty
            },
            {
                questionText: `What is the most important aspect of debugging in ${skill}?`,
                options: [
                    `Understanding the error messages`,
                    `Ignoring the errors`,
                    `Restarting the computer`,
                    `Deleting all code`
                ],
                correctAnswer: `Understanding the error messages`,
                explanation: `Understanding error messages is crucial for effective debugging in ${skill}.`,
                difficulty: difficulty
            }
        ],
        'Data Science': [
            {
                questionText: `What is the main purpose of ${skill} in data analysis?`,
                options: [
                    `Extracting insights from data`,
                    `Creating websites`,
                    `Designing graphics`,
                    `Writing reports`
                ],
                correctAnswer: `Extracting insights from data`,
                explanation: `${skill} is primarily used for extracting meaningful insights from data.`,
                difficulty: difficulty
            },
            {
                questionText: `Which step is crucial before applying ${skill} to data?`,
                options: [
                    `Data cleaning and preprocessing`,
                    `Writing code immediately`,
                    `Creating visualizations`,
                    `Publishing results`
                ],
                correctAnswer: `Data cleaning and preprocessing`,
                explanation: `Data cleaning and preprocessing is essential before applying ${skill} techniques.`,
                difficulty: difficulty
            }
        ],
        'Design': [
            {
                questionText: `What is the primary goal of ${skill}?`,
                options: [
                    `Creating user-centered experiences`,
                    `Writing code`,
                    `Managing data`,
                    `Analyzing metrics`
                ],
                correctAnswer: `Creating user-centered experiences`,
                explanation: `${skill} focuses on creating user-centered experiences and visual solutions.`,
                difficulty: difficulty
            },
            {
                questionText: `Which principle is most important in ${skill}?`,
                options: [
                    `User experience and usability`,
                    `Complex animations`,
                    `Bright colors always`,
                    `Minimal text`
                ],
                correctAnswer: `User experience and usability`,
                explanation: `User experience and usability are fundamental principles in ${skill}.`,
                difficulty: difficulty
            }
        ],
        'Business': [
            {
                questionText: `What is the main objective of ${skill}?`,
                options: [
                    `Achieving organizational goals`,
                    `Writing code`,
                    `Creating designs`,
                    `Analyzing data`
                ],
                correctAnswer: `Achieving organizational goals`,
                explanation: `${skill} is focused on achieving organizational goals and objectives.`,
                difficulty: difficulty
            },
            {
                questionText: `Which skill is essential for effective ${skill}?`,
                options: [
                    `Strategic thinking and planning`,
                    `Programming knowledge`,
                    `Graphic design skills`,
                    `Data analysis`
                ],
                correctAnswer: `Strategic thinking and planning`,
                explanation: `Strategic thinking and planning are essential for effective ${skill}.`,
                difficulty: difficulty
            }
        ],
        'Marketing': [
            {
                questionText: `What is the primary purpose of ${skill}?`,
                options: [
                    `Reaching and engaging target audiences`,
                    `Writing code`,
                    `Managing databases`,
                    `Creating designs`
                ],
                correctAnswer: `Reaching and engaging target audiences`,
                explanation: `${skill} is primarily used to reach and engage target audiences effectively.`,
                difficulty: difficulty
            },
            {
                questionText: `Which metric is most important in ${skill}?`,
                options: [
                    `Return on investment (ROI)`,
                    `Code quality`,
                    `Design aesthetics`,
                    `Data volume`
                ],
                correctAnswer: `Return on investment (ROI)`,
                explanation: `Return on investment (ROI) is a crucial metric for measuring ${skill} success.`,
                difficulty: difficulty
            }
        ],
        'Cloud & DevOps': [
            {
                questionText: `What is the main benefit of ${skill}?`,
                options: [
                    `Improved deployment and scalability`,
                    `Better design`,
                    `Faster coding`,
                    `Enhanced marketing`
                ],
                correctAnswer: `Improved deployment and scalability`,
                explanation: `${skill} provides improved deployment processes and system scalability.`,
                difficulty: difficulty
            },
            {
                questionText: `Which practice is fundamental in ${skill}?`,
                options: [
                    `Automation and continuous integration`,
                    `Manual processes`,
                    `Design reviews`,
                    `Marketing campaigns`
                ],
                correctAnswer: `Automation and continuous integration`,
                explanation: `Automation and continuous integration are fundamental practices in ${skill}.`,
                difficulty: difficulty
            }
        ],
        'Soft Skills': [
            {
                questionText: `What is the key to effective ${skill}?`,
                options: [
                    `Active listening and empathy`,
                    `Technical knowledge`,
                    `Design skills`,
                    `Data analysis`
                ],
                correctAnswer: `Active listening and empathy`,
                explanation: `Active listening and empathy are key components of effective ${skill}.`,
                difficulty: difficulty
            },
            {
                questionText: `Which approach is most effective for developing ${skill}?`,
                options: [
                    `Practice and real-world application`,
                    `Reading books only`,
                    `Watching videos`,
                    `Taking tests`
                ],
                correctAnswer: `Practice and real-world application`,
                explanation: `Practice and real-world application are most effective for developing ${skill}.`,
                difficulty: difficulty
            }
        ]
    };
    // Get category-specific questions or use default
    const categoryQuestions = skillSpecificQuestions[category] || skillSpecificQuestions['Programming'];
    // Return the requested number of questions
    return categoryQuestions.slice(0, Math.min(count, categoryQuestions.length));
};
// Generate skill recommendations based on assessment results
const generateRecommendations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assessmentResults } = req.body;
        if (!assessmentResults || !Array.isArray(assessmentResults)) {
            return res.status(400).json({ message: 'Assessment results array is required' });
        }
        // Check if Gemini API key is available
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not found, using fallback recommendations');
            const fallbackRecommendations = generateFallbackRecommendations(assessmentResults);
            return res.json({
                success: true,
                recommendations: fallbackRecommendations,
                generatedAt: new Date().toISOString(),
                note: 'Using fallback recommendations (Gemini API key not configured)'
            });
        }
        const recommendations = yield geminiService_1.default.generateSkillRecommendations(assessmentResults);
        res.json({
            success: true,
            recommendations,
            generatedAt: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Error generating recommendations:', error);
        // If Gemini fails, try fallback recommendations
        try {
            const { assessmentResults } = req.body;
            const fallbackRecommendations = generateFallbackRecommendations(assessmentResults);
            return res.json({
                success: true,
                recommendations: fallbackRecommendations,
                generatedAt: new Date().toISOString(),
                note: 'Using fallback recommendations due to API error'
            });
        }
        catch (fallbackError) {
            res.status(500).json({
                message: 'Failed to generate recommendations',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
});
exports.generateRecommendations = generateRecommendations;
// Generate personalized learning path
const generateLearningPath = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skill, currentLevel = 'intermediate' } = req.body;
        if (!skill) {
            return res.status(400).json({ message: 'Skill is required' });
        }
        // Check if Gemini API key is available
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not found, using fallback learning path');
            const fallbackLearningPath = generateFallbackLearningPath(skill, currentLevel);
            return res.json({
                success: true,
                learningPath: fallbackLearningPath,
                generatedAt: new Date().toISOString(),
                note: 'Using fallback learning path (Gemini API key not configured)'
            });
        }
        const learningPath = yield geminiService_1.default.generateLearningPath(skill, currentLevel);
        res.json({
            success: true,
            learningPath,
            generatedAt: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Error generating learning path:', error);
        // If Gemini fails, try fallback learning path
        try {
            const { skill, currentLevel = 'intermediate' } = req.body;
            const fallbackLearningPath = generateFallbackLearningPath(skill, currentLevel);
            return res.json({
                success: true,
                learningPath: fallbackLearningPath,
                generatedAt: new Date().toISOString(),
                note: 'Using fallback learning path due to API error'
            });
        }
        catch (fallbackError) {
            res.status(500).json({
                message: 'Failed to generate learning path',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
});
exports.generateLearningPath = generateLearningPath;
// Fallback recommendations generator
const generateFallbackRecommendations = (assessmentResults) => {
    const allRecommendations = [
        'Practice regularly with hands-on projects',
        'Take online courses to strengthen fundamentals',
        'Join communities and forums for peer learning',
        'Read documentation and best practices',
        'Work on real-world projects to apply knowledge',
        'Seek mentorship from experienced professionals',
        'Participate in coding challenges and competitions',
        'Build a portfolio of your work',
        'Stay updated with industry trends',
        'Focus on problem-solving skills'
    ];
    // Return 3-5 recommendations based on scores
    const lowScoreResults = assessmentResults.filter(result => result.score < 70);
    const recommendations = [];
    if (lowScoreResults.length > 0) {
        recommendations.push(`Focus on improving ${lowScoreResults[0].skill} fundamentals`);
        recommendations.push('Practice regularly with hands-on projects');
    }
    recommendations.push('Take online courses to strengthen your skills');
    recommendations.push('Join communities and forums for peer learning');
    recommendations.push('Build a portfolio of your work');
    return recommendations.slice(0, 5);
};
// Fallback learning path generator
const generateFallbackLearningPath = (skill, currentLevel) => {
    const levelSteps = {
        beginner: [
            {
                title: 'Learn Fundamentals',
                description: `Start with the basics of ${skill}`,
                resources: [`${skill} for Beginners Course`, 'Official Documentation', 'YouTube Tutorials'],
                estimatedTime: '2-3 weeks'
            },
            {
                title: 'Practice Basics',
                description: `Practice basic concepts and exercises`,
                resources: ['Online Practice Platforms', 'Coding Challenges', 'Small Projects'],
                estimatedTime: '1-2 weeks'
            },
            {
                title: 'Build Simple Projects',
                description: `Apply your knowledge to simple projects`,
                resources: ['Project Ideas Repository', 'GitHub Examples', 'Tutorial Projects'],
                estimatedTime: '2-3 weeks'
            }
        ],
        intermediate: [
            {
                title: 'Advanced Concepts',
                description: `Learn advanced ${skill} concepts`,
                resources: [`Advanced ${skill} Course`, 'Technical Books', 'Expert Blogs'],
                estimatedTime: '3-4 weeks'
            },
            {
                title: 'Real-world Applications',
                description: `Work on real-world projects`,
                resources: ['Open Source Projects', 'Freelance Work', 'Personal Projects'],
                estimatedTime: '4-6 weeks'
            },
            {
                title: 'Best Practices',
                description: `Learn industry best practices`,
                resources: ['Style Guides', 'Code Reviews', 'Professional Forums'],
                estimatedTime: '2-3 weeks'
            }
        ],
        advanced: [
            {
                title: 'Expert-level Topics',
                description: `Master expert-level ${skill} concepts`,
                resources: ['Advanced Courses', 'Research Papers', 'Expert Workshops'],
                estimatedTime: '4-6 weeks'
            },
            {
                title: 'Specialization',
                description: `Focus on specific areas of ${skill}`,
                resources: ['Specialized Courses', 'Industry Conferences', 'Expert Mentorship'],
                estimatedTime: '6-8 weeks'
            },
            {
                title: 'Leadership & Teaching',
                description: `Share knowledge and mentor others`,
                resources: ['Teaching Opportunities', 'Conference Speaking', 'Writing Articles'],
                estimatedTime: 'Ongoing'
            }
        ]
    };
    const steps = levelSteps[currentLevel] || levelSteps.intermediate;
    return {
        title: `${skill} Learning Path - ${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level`,
        description: `A comprehensive learning path to master ${skill} at the ${currentLevel} level`,
        steps
    };
};
// Test Gemini API status
const testGeminiAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const hasApiKey = !!process.env.GEMINI_API_KEY;
        const apiKeyLength = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0;
        let testResult = {
            hasApiKey,
            apiKeyLength,
            status: 'NOT_CONFIGURED'
        };
        if (hasApiKey) {
            try {
                console.log('Testing Gemini API connection...');
                const testQuestions = yield geminiService_1.default.generateAssessmentQuestions('JavaScript', 'Programming', 1, 'beginner');
                testResult = {
                    hasApiKey,
                    apiKeyLength,
                    status: 'WORKING',
                    testQuestions: testQuestions.length,
                    sampleQuestion: ((_b = (_a = testQuestions[0]) === null || _a === void 0 ? void 0 : _a.questionText) === null || _b === void 0 ? void 0 : _b.substring(0, 50)) + '...'
                };
            }
            catch (error) {
                testResult = {
                    hasApiKey,
                    apiKeyLength,
                    status: 'ERROR',
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        }
        res.json({
            success: true,
            geminiStatus: testResult,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to test Gemini API',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.testGeminiAPI = testGeminiAPI;
