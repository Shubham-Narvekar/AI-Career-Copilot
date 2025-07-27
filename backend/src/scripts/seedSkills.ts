import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Skill from '../models/Skill';

// Load environment variables
dotenv.config();

// Sample skills data organized by categories
const skillsData = [
    // Programming & Development
    {
        name: 'JavaScript',
        description: 'Modern JavaScript programming language for web development',
        category: 'Programming'
    },
    {
        name: 'Python',
        description: 'Versatile programming language for web development, data science, and automation',
        category: 'Programming'
    },
    {
        name: 'React',
        description: 'JavaScript library for building user interfaces',
        category: 'Programming'
    },
    {
        name: 'Node.js',
        description: 'JavaScript runtime for server-side development',
        category: 'Programming'
    },
    {
        name: 'TypeScript',
        description: 'Typed superset of JavaScript for large-scale applications',
        category: 'Programming'
    },
    {
        name: 'Java',
        description: 'Object-oriented programming language for enterprise applications',
        category: 'Programming'
    },
    {
        name: 'C++',
        description: 'High-performance programming language for system development',
        category: 'Programming'
    },
    {
        name: 'SQL',
        description: 'Structured Query Language for database management',
        category: 'Programming'
    },

    // Data Science & Analytics
    {
        name: 'Data Analysis',
        description: 'Process of inspecting, cleaning, and modeling data',
        category: 'Data Science'
    },
    {
        name: 'Machine Learning',
        description: 'Subset of AI that enables systems to learn from data',
        category: 'Data Science'
    },
    {
        name: 'Statistical Analysis',
        description: 'Collection and interpretation of data to identify patterns',
        category: 'Data Science'
    },
    {
        name: 'Data Visualization',
        description: 'Graphical representation of data and information',
        category: 'Data Science'
    },
    {
        name: 'Big Data',
        description: 'Processing and analysis of large, complex datasets',
        category: 'Data Science'
    },
    {
        name: 'Deep Learning',
        description: 'Subset of machine learning using neural networks',
        category: 'Data Science'
    },

    // Design & Creative
    {
        name: 'UI/UX Design',
        description: 'User interface and user experience design',
        category: 'Design'
    },
    {
        name: 'Graphic Design',
        description: 'Visual communication through typography and imagery',
        category: 'Design'
    },
    {
        name: 'Web Design',
        description: 'Designing websites and web applications',
        category: 'Design'
    },
    {
        name: 'Adobe Creative Suite',
        description: 'Professional design and creative software tools',
        category: 'Design'
    },
    {
        name: 'Figma',
        description: 'Collaborative interface design tool',
        category: 'Design'
    },
    {
        name: 'Sketch',
        description: 'Digital design tool for UI/UX designers',
        category: 'Design'
    },

    // Business & Management
    {
        name: 'Project Management',
        description: 'Planning, organizing, and managing project resources',
        category: 'Business'
    },
    {
        name: 'Leadership',
        description: 'Ability to guide and motivate teams',
        category: 'Business'
    },
    {
        name: 'Strategic Planning',
        description: 'Long-term planning and goal setting',
        category: 'Business'
    },
    {
        name: 'Business Analysis',
        description: 'Analyzing business processes and requirements',
        category: 'Business'
    },
    {
        name: 'Agile Methodology',
        description: 'Iterative approach to project management',
        category: 'Business'
    },
    {
        name: 'Scrum',
        description: 'Agile framework for managing complex work',
        category: 'Business'
    },

    // Marketing & Communication
    {
        name: 'Digital Marketing',
        description: 'Marketing using digital channels and technologies',
        category: 'Marketing'
    },
    {
        name: 'Content Marketing',
        description: 'Creating and distributing valuable content',
        category: 'Marketing'
    },
    {
        name: 'Social Media Marketing',
        description: 'Marketing through social media platforms',
        category: 'Marketing'
    },
    {
        name: 'SEO',
        description: 'Search Engine Optimization for web visibility',
        category: 'Marketing'
    },
    {
        name: 'Email Marketing',
        description: 'Marketing through email campaigns',
        category: 'Marketing'
    },
    {
        name: 'Copywriting',
        description: 'Writing persuasive marketing content',
        category: 'Marketing'
    },

    // Cloud & DevOps
    {
        name: 'AWS',
        description: 'Amazon Web Services cloud computing platform',
        category: 'Cloud & DevOps'
    },
    {
        name: 'Docker',
        description: 'Containerization platform for applications',
        category: 'Cloud & DevOps'
    },
    {
        name: 'Kubernetes',
        description: 'Container orchestration platform',
        category: 'Cloud & DevOps'
    },
    {
        name: 'CI/CD',
        description: 'Continuous Integration and Continuous Deployment',
        category: 'Cloud & DevOps'
    },
    {
        name: 'Linux',
        description: 'Open-source operating system',
        category: 'Cloud & DevOps'
    },
    {
        name: 'Git',
        description: 'Version control system for tracking code changes',
        category: 'Cloud & DevOps'
    },

    // Soft Skills
    {
        name: 'Communication',
        description: 'Effective verbal and written communication skills',
        category: 'Soft Skills'
    },
    {
        name: 'Problem Solving',
        description: 'Analytical thinking and creative problem-solving',
        category: 'Soft Skills'
    },
    {
        name: 'Teamwork',
        description: 'Collaborating effectively with others',
        category: 'Soft Skills'
    },
    {
        name: 'Time Management',
        description: 'Organizing and prioritizing tasks efficiently',
        category: 'Soft Skills'
    },
    {
        name: 'Critical Thinking',
        description: 'Analyzing information to make informed decisions',
        category: 'Soft Skills'
    },
    {
        name: 'Adaptability',
        description: 'Flexibility and ability to handle change',
        category: 'Soft Skills'
    }
];

async function seedSkills() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/career-planner';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing skills
        await Skill.deleteMany({});
        console.log('Cleared existing skills');

        // Insert new skills
        const skills = await Skill.insertMany(skillsData);
        console.log(`Successfully seeded ${skills.length} skills`);

        // Display categories and skills count
        const categories = [...new Set(skillsData.map(skill => skill.category))];
        console.log('\nCategories created:');
        categories.forEach(category => {
            const count = skillsData.filter(skill => skill.category === category).length;
            console.log(`- ${category}: ${count} skills`);
        });

        console.log('\nSeeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding skills:', error);
        process.exit(1);
    }
}

seedSkills(); 