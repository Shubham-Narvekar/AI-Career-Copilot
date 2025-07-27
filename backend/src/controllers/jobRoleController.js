"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendJobs = exports.deleteJobRole = exports.updateJobRole = exports.createJobRole = exports.getJobRoleById = exports.getJobRoles = void 0;
const JobRole_1 = __importDefault(require("../models/JobRole"));
const User_1 = __importDefault(require("../models/User"));
// Get all job roles
const getJobRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield JobRole_1.default.find().populate('requiredSkills').populate('recommendedLearningPaths');
        res.json(roles);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getJobRoles = getJobRoles;
// Get job role by ID
const getJobRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield JobRole_1.default.findById(req.params.id).populate('requiredSkills').populate('recommendedLearningPaths');
        if (!role)
            return res.status(404).json({ message: 'Job role not found' });
        res.json(role);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getJobRoleById = getJobRoleById;
// Create a new job role
const createJobRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, requiredSkills, recommendedLearningPaths } = req.body;
        const role = yield JobRole_1.default.create({ title, description, requiredSkills, recommendedLearningPaths });
        res.status(201).json(role);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.createJobRole = createJobRole;
// Update a job role
const updateJobRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, requiredSkills, recommendedLearningPaths } = req.body;
        const role = yield JobRole_1.default.findByIdAndUpdate(req.params.id, { title, description, requiredSkills, recommendedLearningPaths }, { new: true });
        if (!role)
            return res.status(404).json({ message: 'Job role not found' });
        res.json(role);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.updateJobRole = updateJobRole;
// Delete a job role
const deleteJobRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield JobRole_1.default.findByIdAndDelete(req.params.id);
        if (!role)
            return res.status(404).json({ message: 'Job role not found' });
        res.json({ message: 'Job role deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.deleteJobRole = deleteJobRole;
// Recommend jobs based on user skills (basic version)
const recommendJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // For now, just return all job roles (replace with real logic as needed)
        const roles = yield JobRole_1.default.find().populate('requiredSkills').populate('recommendedLearningPaths');
        res.json(roles);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.recommendJobs = recommendJobs;
