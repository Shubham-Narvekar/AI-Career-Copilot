"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assessmentController_1 = require("../controllers/assessmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Test Gemini API status
router.get('/test-gemini', assessmentController_1.testGeminiAPI);
// Assessment Questions
router.get('/questions', assessmentController_1.getQuestions);
router.get('/questions/:id', assessmentController_1.getQuestionById);
router.post('/questions', authMiddleware_1.authenticateJWT, assessmentController_1.createQuestion);
router.put('/questions/:id', authMiddleware_1.authenticateJWT, assessmentController_1.updateQuestion);
router.delete('/questions/:id', authMiddleware_1.authenticateJWT, assessmentController_1.deleteQuestion);
// Assessment Results
router.post('/results', authMiddleware_1.authenticateJWT, assessmentController_1.submitResult);
router.get('/results/user/:userId', authMiddleware_1.authenticateJWT, assessmentController_1.getResultsByUser);
// Gemini AI-powered Assessment Generation
router.post('/generate-questions', authMiddleware_1.authenticateJWT, assessmentController_1.generateQuestions);
router.post('/generate-recommendations', authMiddleware_1.authenticateJWT, assessmentController_1.generateRecommendations);
router.post('/generate-learning-path', authMiddleware_1.authenticateJWT, assessmentController_1.generateLearningPath);
exports.default = router;
