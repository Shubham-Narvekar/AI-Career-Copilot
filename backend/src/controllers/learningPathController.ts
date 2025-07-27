import { Request, Response } from 'express';
import LearningPath from '../models/LearningPath';

// Get all learning paths
export const getLearningPaths = async (req: Request, res: Response) => {
    try {
        const paths = await LearningPath.find().populate('relatedSkills').populate('users');
        res.json(paths);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Get learning path by ID
export const getLearningPathById = async (req: Request, res: Response) => {
    try {
        const path = await LearningPath.findById(req.params.id).populate('relatedSkills').populate('users');
        if (!path) return res.status(404).json({ message: 'Learning path not found' });
        res.json(path);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Create a new learning path
export const createLearningPath = async (req: Request, res: Response) => {
    try {
        const { title, description, steps, relatedSkills, users } = req.body;
        const path = await LearningPath.create({ title, description, steps, relatedSkills, users });
        res.status(201).json(path);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Update a learning path
export const updateLearningPath = async (req: Request, res: Response) => {
    try {
        const { title, description, steps, relatedSkills, users } = req.body;
        const path = await LearningPath.findByIdAndUpdate(
            req.params.id,
            { title, description, steps, relatedSkills, users },
            { new: true }
        );
        if (!path) return res.status(404).json({ message: 'Learning path not found' });
        res.json(path);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Delete a learning path
export const deleteLearningPath = async (req: Request, res: Response) => {
    try {
        const path = await LearningPath.findByIdAndDelete(req.params.id);
        if (!path) return res.status(404).json({ message: 'Learning path not found' });
        res.json({ message: 'Learning path deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}; 