"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resumeController_1 = require("../controllers/resumeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Test route to check if resume routes are working
router.get('/test', resumeController_1.testResumeRoute);
// Get all resumes (admin or for testing)
router.get('/', resumeController_1.getResumes);
// Get resume by user (must come before /:id route)
router.get('/user/:userId', authMiddleware_1.authenticateJWT, resumeController_1.getResumeByUser);
// Get resume by ID
router.get('/:id', resumeController_1.getResumeById);
// Create a new resume
router.post('/', authMiddleware_1.authenticateJWT, resumeController_1.createResume);
// Update a resume
router.put('/:id', authMiddleware_1.authenticateJWT, resumeController_1.updateResume);
// Delete a resume
router.delete('/:id', authMiddleware_1.authenticateJWT, resumeController_1.deleteResume);
exports.default = router;
