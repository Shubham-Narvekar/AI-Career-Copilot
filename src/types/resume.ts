export interface Resume {
    id: string;
    userId: string;
    title: string;
    template: ResumeTemplate;
    sections: ResumeSection[];
    createdAt: string;
    updatedAt: string;
}

export interface ResumeSection {
    id: string;
    type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
    title: string;
    content: any;
    order: number;
    isVisible: boolean;
}

export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    preview: string;
    colors: {
        primary: string;
        secondary: string;
        text: string;
        background: string;
    };
}

export interface ResumeHeader {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
}

export interface ResumeSummary {
    content: string;
}

export interface ResumeExperience {
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
    achievements: string[];
}

export interface ResumeEducation {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location?: string;
    startDate: string;
    endDate?: string;
    gpa?: number;
    relevantCourses?: string[];
}

export interface ResumeSkills {
    technical: string[];
    soft: string[];
    languages?: string[];
    tools?: string[];
}

export interface ResumeProject {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    url?: string;
    githubUrl?: string;
    imageUrl?: string;
}

export interface ResumeCertification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
} 