import { Request, Response } from 'express';
import Resume from '../models/Resume';

// Get all resumes (admin or for testing)
export const getResumes = async (req: Request, res: Response) => {
    try {
        const resumes = await Resume.find().populate('user');
        res.json(resumes);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Get resume by ID
export const getResumeById = async (req: Request, res: Response) => {
    try {
        const resume = await Resume.findById(req.params.id).populate('user');
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Get resume by user
export const getResumeByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        // Validate user ID format
        if (!userId || userId.length !== 24) {
            return res.status(400).json({ 
                message: 'Invalid user ID format',
                userId: userId 
            });
        }

        console.log(`Fetching resumes for user: ${userId}`);
        
        let resumes = await Resume.find({ user: userId }).populate('user');
        console.log(`Found ${resumes.length} resumes for user ${userId}`);
        
        // If no resumes exist, create a sample resume for testing
        if (resumes.length === 0) {
            console.log('No resumes found, creating sample resume for testing');
            const sampleResume = await Resume.create({
                user: userId,
                content: {
                    personalInfo: {
                        name: 'Sample User',
                        email: 'sample@example.com',
                        phone: '+1-234-567-8900',
                        location: 'City, State'
                    },
                    summary: 'Experienced professional with expertise in multiple domains.',
                    experience: [
                        {
                            title: 'Sample Position',
                            company: 'Sample Company',
                            duration: '2020 - Present',
                            description: 'Sample job description and responsibilities.'
                        }
                    ],
                    education: [
                        {
                            degree: 'Bachelor\'s Degree',
                            institution: 'Sample University',
                            year: '2020'
                        }
                    ],
                    skills: ['Sample Skill 1', 'Sample Skill 2', 'Sample Skill 3']
                }
            });
            resumes = [sampleResume];
            console.log('Sample resume created successfully');
        }
        
        res.json(resumes || []);
    } catch (err) {
        console.error('Error fetching resumes by user:', err);
        res.status(500).json({ 
            message: 'Server error', 
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
};

// Create a new resume
export const createResume = async (req: Request, res: Response) => {
    try {
        const { user, content } = req.body;
        const resume = await Resume.create({ user, content });
        res.status(201).json(resume);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Update a resume
export const updateResume = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const resume = await Resume.findByIdAndUpdate(
            req.params.id,
            { content },
            { new: true }
        );
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Delete a resume
export const deleteResume = async (req: Request, res: Response) => {
    try {
        const resume = await Resume.findByIdAndDelete(req.params.id);
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        res.json({ message: 'Resume deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}; 

// Test endpoint to check if resume routes are working
export const testResumeRoute = async (req: Request, res: Response) => {
    try {
        res.json({ 
            message: 'Resume routes are working',
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}; 