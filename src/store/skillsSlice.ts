import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SkillCategory, AssessmentQuestion, AIGeneratedQuestion, SkillsAssessment, SkillGap, Skill } from '../types/skills';
import { api } from '../services/api';
import { toast } from 'react-toastify';

interface SkillsState {
    categories: SkillCategory[];
    allSkills: Skill[];
    skillCategories: string[];
    currentAssessment: (AssessmentQuestion | AIGeneratedQuestion)[];
    currentQuestionIndex: number;
    answers: Record<string, any>;
    isLoading: boolean;
    error: string | null;
    assessmentResults: SkillsAssessment | null;
    skillGaps: SkillGap[];
}

const initialState: SkillsState = {
    categories: [],
    allSkills: [],
    skillCategories: [],
    currentAssessment: [],
    currentQuestionIndex: 0,
    answers: {},
    isLoading: false,
    error: null,
    assessmentResults: null,
    skillGaps: [],
};

export const fetchSkillsCategories = createAsyncThunk(
    'skills/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            // Fetch skills and categories separately
            const [skills, categories] = await Promise.all([
                api.get('/api/skills'),
                api.get('/api/skills/categories')
            ]);

            // Organize skills by category
            const organizedCategories = categories.map((category: string) => ({
                id: category.toLowerCase().replace(/\s+/g, '-'),
                name: category,
                description: `${category} related skills and competencies`,
                icon: getCategoryIcon(category),
                color: getCategoryColor(category),
                skills: skills.filter((skill: Skill) => skill.category === category)
            }));

            return {
                categories: organizedCategories,
                allSkills: skills,
                skillCategories: categories
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch skills');
        }
    }
);

// Helper function to get category icons
const getCategoryIcon = (category: string): string => {
    const iconMap: Record<string, string> = {
        'Programming': '💻',
        'Data Science': '📊',
        'Design': '🎨',
        'Business': '💼',
        'Marketing': '📈',
        'Cloud & DevOps': '☁️',
        'Soft Skills': '🤝'
    };
    return iconMap[category] || '💡';
};

// Helper function to get category colors
const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
        'Programming': 'from-blue-500 to-purple-600',
        'Data Science': 'from-green-500 to-teal-600',
        'Design': 'from-pink-500 to-red-600',
        'Business': 'from-indigo-500 to-blue-600',
        'Marketing': 'from-orange-500 to-red-600',
        'Cloud & DevOps': 'from-gray-500 to-blue-600',
        'Soft Skills': 'from-yellow-500 to-orange-600'
    };
    return colorMap[category] || 'from-blue-500 to-purple-600';
};

export const createSkill = createAsyncThunk(
    'skills/createSkill',
    async (skill: Partial<Skill>, { rejectWithValue }) => {
        try {
            const newSkill: Skill = await api.post('/api/skills', skill);
            return newSkill;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create skill');
        }
    }
);

export const updateSkill = createAsyncThunk(
    'skills/updateSkill',
    async ({ id, ...updates }: Partial<Skill> & { id: string }, { rejectWithValue }) => {
        try {
            const updatedSkill: Skill = await api.put(`/api/skills/${id}`, updates);
            return updatedSkill;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update skill');
        }
    }
);

export const deleteSkill = createAsyncThunk(
    'skills/deleteSkill',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/api/skills/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete skill');
        }
    }
);

// Gemini AI-powered Assessment Functions
export const generateAssessmentQuestions = createAsyncThunk(
    'skills/generateQuestions',
    async ({ skill, category, count = 5, difficulty = 'intermediate' }: {
        skill: string;
        category: string;
        count?: number;
        difficulty?: 'beginner' | 'intermediate' | 'advanced';
    }, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/assessments/generate-questions', {
                skill,
                category,
                count,
                difficulty
            });
            return response.questions;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to generate questions');
        }
    }
);

export const generateSkillRecommendations = createAsyncThunk(
    'skills/generateRecommendations',
    async (assessmentResults: { skill: string; score: number }[], { rejectWithValue }) => {
        try {
            const response = await api.post('/api/assessments/generate-recommendations', {
                assessmentResults
            });
            return response.recommendations;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to generate recommendations');
        }
    }
);

export const generatePersonalizedLearningPath = createAsyncThunk(
    'skills/generateLearningPath',
    async ({ skill, currentLevel = 'intermediate' }: {
        skill: string;
        currentLevel?: 'beginner' | 'intermediate' | 'advanced';
    }, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/assessments/generate-learning-path', {
                skill,
                currentLevel
            });
            return response.learningPath;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to generate learning path');
        }
    }
);

const skillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        setCurrentQuestion: (state, action: PayloadAction<number>) => {
            state.currentQuestionIndex = action.payload;
        },
        setAnswer: (state, action: PayloadAction<{ questionId: string; answer: any }>) => {
            state.answers[action.payload.questionId] = action.payload.answer;
        },
        clearAssessment: (state) => {
            state.currentAssessment = [];
            state.currentQuestionIndex = 0;
            state.answers = {};
            state.assessmentResults = null;
            state.skillGaps = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch categories
            .addCase(fetchSkillsCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSkillsCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload.categories;
                state.allSkills = action.payload.allSkills;
                state.skillCategories = action.payload.skillCategories;
            })
            .addCase(fetchSkillsCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch categories';
            })
            // Create skill
            .addCase(createSkill.fulfilled, (state, action) => {
                toast.success('Skill added successfully!');
            })
            .addCase(updateSkill.fulfilled, (state, action) => {
                toast.success('Skill updated successfully!');
            })
            .addCase(deleteSkill.fulfilled, (state, action) => {
                toast.success('Skill deleted successfully!');
            })
            // Generate assessment questions
            .addCase(generateAssessmentQuestions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(generateAssessmentQuestions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentAssessment = action.payload;
                state.currentQuestionIndex = 0;
                state.answers = {};
                toast.success('AI-generated questions ready!');
            })
            .addCase(generateAssessmentQuestions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to generate questions';
            })
            // Generate skill recommendations
            .addCase(generateSkillRecommendations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(generateSkillRecommendations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.skillGaps = action.payload.map((skill: string) => ({
                    skill,
                    currentLevel: 'beginner',
                    targetLevel: 'intermediate',
                    gap: 'medium'
                }));
                toast.success('AI recommendations generated!');
            })
            .addCase(generateSkillRecommendations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to generate recommendations';
            })
            // Generate learning path
            .addCase(generatePersonalizedLearningPath.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(generatePersonalizedLearningPath.fulfilled, (state, action) => {
                state.isLoading = false;
                toast.success('Personalized learning path created!');
            })
            .addCase(generatePersonalizedLearningPath.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to generate learning path';
            });
    },
});

export const { setCurrentQuestion, setAnswer, clearAssessment, clearError } = skillsSlice.actions;
export default skillsSlice.reducer; 