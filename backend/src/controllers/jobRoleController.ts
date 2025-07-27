import { Request, Response } from 'express';
import JobRole from '../models/JobRole';
import User from '../models/User';

// Get all job roles
export const getJobRoles = async (req: Request, res: Response) => {
    try {
        const roles = await JobRole.find().populate('requiredSkills').populate('recommendedLearningPaths');
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Get job role by ID
export const getJobRoleById = async (req: Request, res: Response) => {
    try {
        const role = await JobRole.findById(req.params.id).populate('requiredSkills').populate('recommendedLearningPaths');
        if (!role) return res.status(404).json({ message: 'Job role not found' });
        res.json(role);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Create a new job role
export const createJobRole = async (req: Request, res: Response) => {
    try {
        const { title, description, requiredSkills, recommendedLearningPaths } = req.body;
        const role = await JobRole.create({ title, description, requiredSkills, recommendedLearningPaths });
        res.status(201).json(role);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Update a job role
export const updateJobRole = async (req: Request, res: Response) => {
    try {
        const { title, description, requiredSkills, recommendedLearningPaths } = req.body;
        const role = await JobRole.findByIdAndUpdate(
            req.params.id,
            { title, description, requiredSkills, recommendedLearningPaths },
            { new: true }
        );
        if (!role) return res.status(404).json({ message: 'Job role not found' });
        res.json(role);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Delete a job role
export const deleteJobRole = async (req: Request, res: Response) => {
    try {
        const role = await JobRole.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).json({ message: 'Job role not found' });
        res.json({ message: 'Job role deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Recommend jobs based on user skills (basic version)
export const recommendJobs = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        // For now, just return all job roles (replace with real logic as needed)
        const roles = await JobRole.find().populate('requiredSkills').populate('recommendedLearningPaths');
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}; 