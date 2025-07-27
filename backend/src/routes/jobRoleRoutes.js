"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobRoleController_1 = require("../controllers/jobRoleController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get all job roles (public)
router.get('/', jobRoleController_1.getJobRoles);
// Get job role by ID (public)
router.get('/:id', jobRoleController_1.getJobRoleById);
// Create a new job role (protected)
router.post('/', authMiddleware_1.authenticateJWT, jobRoleController_1.createJobRole);
// Update a job role (protected)
router.put('/:id', authMiddleware_1.authenticateJWT, jobRoleController_1.updateJobRole);
// Delete a job role (protected)
router.delete('/:id', authMiddleware_1.authenticateJWT, jobRoleController_1.deleteJobRole);
// Recommend jobs for a user (protected)
router.get('/recommend/:userId', authMiddleware_1.authenticateJWT, jobRoleController_1.recommendJobs);
exports.default = router;
