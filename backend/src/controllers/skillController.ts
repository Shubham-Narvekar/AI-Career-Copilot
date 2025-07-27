import { Request, Response } from 'express';
import Skill from '../models/Skill';

// Get all skills
export const getSkills = async (req: Request, res: Response) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Skill.distinct('category');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Get skill by ID
export const getSkillById = async (req: Request, res: Response) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        res.json(skill);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Create a new skill
export const createSkill = async (req: Request, res: Response) => {
    try {
        const { name, description, category } = req.body;
        const existing = await Skill.findOne({ name });
        if (existing) return res.status(400).json({ message: 'Skill already exists' });
        const skill = await Skill.create({ name, description, category });
        res.status(201).json(skill);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Update a skill
export const updateSkill = async (req: Request, res: Response) => {
    try {
        const { name, description, category } = req.body;
        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            { name, description, category },
            { new: true }
        );
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        res.json(skill);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Delete a skill
export const deleteSkill = async (req: Request, res: Response) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        res.json({ message: 'Skill deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}; 