export interface JobRole {
    id: string;
    title: string;
    company?: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
    salary: {
        min: number;
        max: number;
        currency: string;
    };
    description: string;
    requirements: string[];
    responsibilities: string[];
    skills: string[];
    experience: 'entry' | 'mid' | 'senior' | 'lead';
    industry: string;
    matchScore: number;
    isSaved: boolean;
    isApplied: boolean;
    postedDate: string;
    applicationDeadline?: string;
}

export interface JobRecommendationFilters {
    location: string[];
    experience: string[];
    salary: {
        min: number;
        max: number;
    };
    jobType: string[];
    industry: string[];
    skills: string[];
}

export interface JobRecommendationState {
    recommendations: JobRole[];
    savedJobs: JobRole[];
    appliedJobs: JobRole[];
    filters: JobRecommendationFilters;
    isLoading: boolean;
    error: string | null;
    totalResults: number;
    currentPage: number;
    itemsPerPage: number;
}

export interface JobApplication {
    id: string;
    jobId: string;
    userId: string;
    status: 'applied' | 'reviewing' | 'interview' | 'offered' | 'rejected';
    appliedDate: string;

    coverLetter?: string;
    notes?: string;
} 