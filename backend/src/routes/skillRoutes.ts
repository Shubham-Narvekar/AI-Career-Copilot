import { Router } from 'express';
import { getSkills, getSkillById, createSkill, updateSkill, deleteSkill, getCategories } from '../controllers/skillController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Get all skills (public)
router.get('/', getSkills);
// Get all categories (public)
router.get('/categories', getCategories);
// Get skill by ID (public)
router.get('/:id', getSkillById);
// Create a new skill (protected)
router.post('/', authenticateJWT, createSkill);
// Update a skill (protected)
router.put('/:id', authenticateJWT, updateSkill);
// Delete a skill (protected)
router.delete('/:id', authenticateJWT, deleteSkill);

export default router; 