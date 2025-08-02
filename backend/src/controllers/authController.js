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
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User_1.default.create({ name, email, password: hashedPassword });
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.login = login;

// Update user profile
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { 
            name, 
            email, 
            currentPosition, 
            experience, 
            education, 
            location, 
            bio, 
            linkedin, 
            github, 
            website 
        } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }
        
        const updateData = { name, email };
        
        // Add optional fields if provided
        if (currentPosition !== undefined) updateData.currentPosition = currentPosition;
        if (experience !== undefined) updateData.experience = experience;
        if (education !== undefined) updateData.education = education;
        if (location !== undefined) updateData.location = location;
        if (bio !== undefined) updateData.bio = bio;
        if (linkedin !== undefined) updateData.linkedin = linkedin;
        if (github !== undefined) updateData.github = github;
        if (website !== undefined) updateData.website = website;
        
        const updatedUser = yield User_1.default.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get user profile
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const user = yield User_1.default.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

exports.updateProfile = updateProfile;
exports.getProfile = getProfile;
