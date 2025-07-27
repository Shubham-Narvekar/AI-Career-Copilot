export interface LearningPath {
    id: string;
    userId: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    steps: LearningPathStep[];
    progress: number; // 0-100
    recommendedFor: string[]; // e.g. ['Frontend Developer']
}

export interface LearningPathStep {
    id: string;
    title: string;
    description: string;
    order: number;
    status: 'not-started' | 'in-progress' | 'completed';
    resources: LearningResource[];
    estimatedTimeHours: number;
}

export interface LearningResource {
    id: string;
    title: string;
    url: string;
    type: 'video' | 'article' | 'course' | 'book' | 'project';
    provider?: string;
    durationMinutes?: number;
    isFree: boolean;
} 