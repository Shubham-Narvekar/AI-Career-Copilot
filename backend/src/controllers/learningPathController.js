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
exports.deleteLearningPath = exports.updateLearningPath = exports.createLearningPath = exports.getLearningPathById = exports.getLearningPaths = void 0;
const LearningPath_1 = __importDefault(require("../models/LearningPath"));
// Get all learning paths
const getLearningPaths = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paths = yield LearningPath_1.default.find().populate('relatedSkills').populate('users');
        res.json(paths);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getLearningPaths = getLearningPaths;
// Get learning path by ID
const getLearningPathById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const path = yield LearningPath_1.default.findById(req.params.id).populate('relatedSkills').populate('users');
        if (!path)
            return res.status(404).json({ message: 'Learning path not found' });
        res.json(path);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getLearningPathById = getLearningPathById;
// Create a new learning path
const createLearningPath = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, steps, relatedSkills, users } = req.body;
        const path = yield LearningPath_1.default.create({ title, description, steps, relatedSkills, users });
        res.status(201).json(path);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.createLearningPath = createLearningPath;
// Update a learning path
const updateLearningPath = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, steps, relatedSkills, users } = req.body;
        const path = yield LearningPath_1.default.findByIdAndUpdate(req.params.id, { title, description, steps, relatedSkills, users }, { new: true });
        if (!path)
            return res.status(404).json({ message: 'Learning path not found' });
        res.json(path);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.updateLearningPath = updateLearningPath;
// Delete a learning path
const deleteLearningPath = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const path = yield LearningPath_1.default.findByIdAndDelete(req.params.id);
        if (!path)
            return res.status(404).json({ message: 'Learning path not found' });
        res.json({ message: 'Learning path deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.deleteLearningPath = deleteLearningPath;
