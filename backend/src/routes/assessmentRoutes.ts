import { Router } from 'express';
import {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    submitResult,
    getResultsByUser,
    generateQuestions,
    generateRecommendations,
    generateLearningPath,
    testGeminiAPI
} from '../controllers/assessmentController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Test Gemini API status
router.get('/test-gemini', testGeminiAPI);

// Assessment Questions
router.get('/questions', getQuestions);
router.get('/questions/:id', getQuestionById);
router.post('/questions', authenticateJWT, createQuestion);
router.put('/questions/:id', authenticateJWT, updateQuestion);
router.delete('/questions/:id', authenticateJWT, deleteQuestion);

// Assessment Results
router.post('/results', authenticateJWT, submitResult);
router.get('/results/user/:userId', authenticateJWT, getResultsByUser);

// Gemini AI-powered Assessment Generation
router.post('/generate-questions', authenticateJWT, generateQuestions);
router.post('/generate-recommendations', authenticateJWT, generateRecommendations);
router.post('/generate-learning-path', authenticateJWT, generateLearningPath);

export default router; 