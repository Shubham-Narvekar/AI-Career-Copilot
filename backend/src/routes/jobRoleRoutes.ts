import { Router } from 'express';
import {
    getJobRoles,
    getJobRoleById,
    createJobRole,
    updateJobRole,
    deleteJobRole,
    recommendJobs
} from '../controllers/jobRoleController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Get all job roles (public)
router.get('/', getJobRoles);
// Get job role by ID (public)
router.get('/:id', getJobRoleById);
// Create a new job role (protected)
router.post('/', authenticateJWT, createJobRole);
// Update a job role (protected)
router.put('/:id', authenticateJWT, updateJobRole);
// Delete a job role (protected)
router.delete('/:id', authenticateJWT, deleteJobRole);
// Recommend jobs for a user (protected)
router.get('/recommend/:userId', authenticateJWT, recommendJobs);

export default router; 