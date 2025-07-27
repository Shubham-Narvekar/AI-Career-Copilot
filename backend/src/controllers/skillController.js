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
exports.deleteSkill = exports.updateSkill = exports.createSkill = exports.getSkillById = exports.getCategories = exports.getSkills = void 0;
const Skill_1 = __importDefault(require("../models/Skill"));
// Get all skills
const getSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skills = yield Skill_1.default.find();
        res.json(skills);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getSkills = getSkills;
// Get all categories
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Skill_1.default.distinct('category');
        res.json(categories);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getCategories = getCategories;
// Get skill by ID
const getSkillById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skill = yield Skill_1.default.findById(req.params.id);
        if (!skill)
            return res.status(404).json({ message: 'Skill not found' });
        res.json(skill);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getSkillById = getSkillById;
// Create a new skill
const createSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, category } = req.body;
        const existing = yield Skill_1.default.findOne({ name });
        if (existing)
            return res.status(400).json({ message: 'Skill already exists' });
        const skill = yield Skill_1.default.create({ name, description, category });
        res.status(201).json(skill);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.createSkill = createSkill;
// Update a skill
const updateSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, category } = req.body;
        const skill = yield Skill_1.default.findByIdAndUpdate(req.params.id, { name, description, category }, { new: true });
        if (!skill)
            return res.status(404).json({ message: 'Skill not found' });
        res.json(skill);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.updateSkill = updateSkill;
// Delete a skill
const deleteSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skill = yield Skill_1.default.findByIdAndDelete(req.params.id);
        if (!skill)
            return res.status(404).json({ message: 'Skill not found' });
        res.json({ message: 'Skill deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.deleteSkill = deleteSkill;
