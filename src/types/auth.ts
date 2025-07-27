export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: 'student' | 'professional';
    currentPosition?: string;
    yearsOfExperience?: number;
    education?: Education[];
    skills: Skill[];
    interests: string[];
    goals: CareerGoal[];
    createdAt: string;
    updatedAt: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    gpa?: number;
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'expert';
    yearsOfExperience?: number;
    isVerified: boolean;
}

export interface CareerGoal {
    id: string;
    title: string;
    description: string;
    targetDate: string;
    isCompleted: boolean;
    progress: number;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'professional';
}

export interface ProfileSetupData {
    currentPosition?: string;
    yearsOfExperience?: number;
    education?: Education[];
    skills: Skill[];
    interests: string[];
    goals: CareerGoal[];
} 