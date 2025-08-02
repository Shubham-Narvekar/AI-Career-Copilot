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

// Recommend jobs based on user skills with AI-powered matching
export const recommendJobs = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get all job roles
        const allRoles = await JobRole.find().populate('requiredSkills').populate('recommendedLearningPaths');
        
        // Enhanced job recommendations with mock data for demonstration
        const enhancedJobs = allRoles.map(role => {
            // Calculate match score based on user profile and job requirements
            let matchScore = Math.floor(Math.random() * 30) + 70; // 70-100 for demo
            
            // Adjust score based on user experience
            if (user.experience) {
                const experienceLevel = user.experience;
                if (experienceLevel === '0-1' && role.experience === 'entry') matchScore += 10;
                if (experienceLevel === '1-3' && role.experience === 'mid') matchScore += 10;
                if (experienceLevel === '3-5' && role.experience === 'senior') matchScore += 10;
                if (experienceLevel === '5-10' && role.experience === 'lead') matchScore += 10;
            }

            // Create enhanced job data
            const enhancedJob = {
                id: role._id,
                title: role.title,
                company: getRandomCompany(),
                location: getRandomLocation(),
                type: getRandomJobType(),
                salary: {
                    min: getRandomSalary(role.experience).min,
                    max: getRandomSalary(role.experience).max,
                    currency: '$'
                },
                description: role.description,
                requirements: generateRequirements(role.experience),
                responsibilities: generateResponsibilities(role.title),
                skills: role.requiredSkills?.map((skill: any) => skill.name) || ['JavaScript', 'React', 'Node.js'],
                experience: role.experience || 'mid',
                industry: getRandomIndustry(),
                matchScore: Math.min(100, matchScore),
                isSaved: false,
                isApplied: false,
                postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                applicationDeadline: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
            };

            return enhancedJob;
        });

        // Sort by match score
        enhancedJobs.sort((a, b) => b.matchScore - a.matchScore);

        res.json(enhancedJobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Helper functions for generating mock data
const getRandomCompany = () => {
    const companies = [
        'TechCorp', 'InnovateSoft', 'Digital Solutions', 'Future Systems', 'CloudTech',
        'DataFlow', 'SmartApps', 'NextGen', 'CyberSecure', 'AI Dynamics'
    ];
    return companies[Math.floor(Math.random() * companies.length)];
};

const getRandomLocation = () => {
    const locations = [
        'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA',
        'Denver, CO', 'Chicago, IL', 'Los Angeles, CA', 'Remote', 'Hybrid'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
};

const getRandomJobType = () => {
    const types = ['full-time', 'part-time', 'contract', 'remote'];
    return types[Math.floor(Math.random() * types.length)];
};

const getRandomIndustry = () => {
    const industries = ['technology', 'healthcare', 'finance', 'education', 'retail'];
    return industries[Math.floor(Math.random() * industries.length)];
};

const getRandomSalary = (experience: string) => {
    switch (experience) {
        case 'entry':
            return { min: 50000, max: 70000 };
        case 'mid':
            return { min: 70000, max: 100000 };
        case 'senior':
            return { min: 100000, max: 150000 };
        case 'lead':
            return { min: 120000, max: 200000 };
        default:
            return { min: 70000, max: 100000 };
    }
};

const generateRequirements = (experience: string) => {
    const baseRequirements = [
        'Strong problem-solving skills',
        'Excellent communication abilities',
        'Ability to work in a team environment'
    ];

    const experienceRequirements = {
        entry: [
            'Bachelor\'s degree in Computer Science or related field',
            'Basic knowledge of programming concepts',
            'Willingness to learn new technologies'
        ],
        mid: [
            '3+ years of professional experience',
            'Proficiency in multiple programming languages',
            'Experience with modern development practices'
        ],
        senior: [
            '5+ years of professional experience',
            'Deep technical expertise',
            'Experience mentoring junior developers'
        ],
        lead: [
            '7+ years of professional experience',
            'Proven leadership experience',
            'Experience with architectural decisions'
        ]
    };

    return [...baseRequirements, ...(experienceRequirements[experience as keyof typeof experienceRequirements] || experienceRequirements.mid)];
};

const generateResponsibilities = (title: string) => {
    const responsibilities = [
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code',
        'Participate in code reviews',
        'Contribute to technical documentation'
    ];

    if (title.toLowerCase().includes('lead') || title.toLowerCase().includes('senior')) {
        responsibilities.push('Mentor junior team members');
        responsibilities.push('Make architectural decisions');
    }

    return responsibilities;
}; 