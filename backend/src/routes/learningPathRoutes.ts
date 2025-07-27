import { Router } from 'express';
import {
    getLearningPaths,
    getLearningPathById,
    createLearningPath,
    updateLearningPath,
    deleteLearningPath
} from '../controllers/learningPathController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Get all learning paths (public)
router.get('/', getLearningPaths);
// Get learning path by ID (public)
router.get('/:id', getLearningPathById);
// Create a new learning path (protected)
router.post('/', authenticateJWT, createLearningPath);
// Update a learning path (protected)
router.put('/:id', authenticateJWT, updateLearningPath);
// Delete a learning path (protected)
router.delete('/:id', authenticateJWT, deleteLearningPath);

export default router; 