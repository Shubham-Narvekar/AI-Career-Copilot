export interface SkillCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    skills: Skill[];
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'expert';
    yearsOfExperience?: number;
    isVerified: boolean;
    description?: string;
    importance: 'low' | 'medium' | 'high';
}

export interface AssessmentQuestion {
    id: string;
    question: string;
    type: 'multiple-choice' | 'rating' | 'text' | 'checkbox';
    options?: string[];
    category: string;
    skillId?: string;
    required: boolean;
}

// Interface for AI-generated questions from Gemini
export interface AIGeneratedQuestion {
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface AssessmentResult {
    categoryId: string;
    categoryName: string;
    skills: Skill[];
    totalScore: number;
    maxScore: number;
    percentage: number;
    recommendations: string[];
}

export interface SkillsAssessment {
    id: string;
    userId: string;
    completedAt: string;
    results: AssessmentResult[];
    totalScore: number;
    overallPercentage: number;
    recommendations: string[];
    nextSteps: string[];
}

export interface SkillGap {
    skillId: string;
    skillName: string;
    category: string;
    currentLevel: 'beginner' | 'intermediate' | 'expert';
    targetLevel: 'beginner' | 'intermediate' | 'expert';
    gap: number;
    priority: 'low' | 'medium' | 'high';
    learningResources: string[];
} 