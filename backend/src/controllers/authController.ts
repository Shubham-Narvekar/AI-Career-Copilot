import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                currentPosition: user.currentPosition,
                experience: user.experience,
                education: user.education,
                location: user.location,
                bio: user.bio,
                linkedin: user.linkedin,
                github: user.github,
                website: user.website,
                role: user.role
            } 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                currentPosition: user.currentPosition,
                experience: user.experience,
                education: user.education,
                location: user.location,
                bio: user.bio,
                linkedin: user.linkedin,
                github: user.github,
                website: user.website,
                role: user.role
            } 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Update user profile
export const updateProfile = async (req: any, res: any) => {
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
        
        const updateData: any = { name, email };
        
        // Add optional fields if provided
        if (currentPosition !== undefined) updateData.currentPosition = currentPosition;
        if (experience !== undefined) updateData.experience = experience;
        if (education !== undefined) updateData.education = education;
        if (location !== undefined) updateData.location = location;
        if (bio !== undefined) updateData.bio = bio;
        if (linkedin !== undefined) updateData.linkedin = linkedin;
        if (github !== undefined) updateData.github = github;
        if (website !== undefined) updateData.website = website;
        
        const updatedUser = await User.findByIdAndUpdate(
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
};

// Get user profile
export const getProfile = async (req: any, res: any) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}; 