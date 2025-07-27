"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const learningPathController_1 = require("../controllers/learningPathController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get all learning paths (public)
router.get('/', learningPathController_1.getLearningPaths);
// Get learning path by ID (public)
router.get('/:id', learningPathController_1.getLearningPathById);
// Create a new learning path (protected)
router.post('/', authMiddleware_1.authenticateJWT, learningPathController_1.createLearningPath);
// Update a learning path (protected)
router.put('/:id', authMiddleware_1.authenticateJWT, learningPathController_1.updateLearningPath);
// Delete a learning path (protected)
router.delete('/:id', authMiddleware_1.authenticateJWT, learningPathController_1.deleteLearningPath);
exports.default = router;
