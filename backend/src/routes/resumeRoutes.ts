import { Router } from 'express';
import {
    getResumes,
    getResumeById,
    getResumeByUser,
    createResume,
    updateResume,
    deleteResume,
    testResumeRoute
} from '../controllers/resumeController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Test route to check if resume routes are working
router.get('/test', testResumeRoute);

// Get all resumes (admin or for testing)
router.get('/', getResumes);

// Get resume by user (must come before /:id route)
router.get('/user/:userId', authenticateJWT, getResumeByUser);

// Get resume by ID
router.get('/:id', getResumeById);

// Create a new resume
router.post('/', authenticateJWT, createResume);
// Update a resume
router.put('/:id', authenticateJWT, updateResume);
// Delete a resume
router.delete('/:id', authenticateJWT, deleteResume);

export default router; 