"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const skillController_1 = require("../controllers/skillController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get all skills (public)
router.get('/', skillController_1.getSkills);
// Get all categories (public)
router.get('/categories', skillController_1.getCategories);
// Get skill by ID (public)
router.get('/:id', skillController_1.getSkillById);
// Create a new skill (protected)
router.post('/', authMiddleware_1.authenticateJWT, skillController_1.createSkill);
// Update a skill (protected)
router.put('/:id', authMiddleware_1.authenticateJWT, skillController_1.updateSkill);
// Delete a skill (protected)
router.delete('/:id', authMiddleware_1.authenticateJWT, skillController_1.deleteSkill);
exports.default = router;
