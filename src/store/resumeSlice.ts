import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Resume, ResumeTemplate } from '../types/resume';
import { api } from '../services/api';
import { toast } from 'react-toastify';

interface ResumeState {
    resumes: Resume[];
    currentResume: Resume | null;
    templates: ResumeTemplate[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ResumeState = {
    resumes: [],
    currentResume: null,
    templates: [],
    isLoading: false,
    error: null,
};

export const fetchResumes = createAsyncThunk(
    'resume/fetchResumes',
    async (userId: string, { rejectWithValue }) => {
        try {
            const resumes: Resume[] = await api.get(`/api/resumes/user/${userId}`);
            return resumes || [];
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch resumes');
        }
    }
);

export const createResume = createAsyncThunk(
    'resume/createResume',
    async (resume: Partial<Resume>, { rejectWithValue }) => {
        try {
            const newResume: Resume = await api.post('/api/resumes', resume);
            return newResume;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create resume');
        }
    }
);

export const updateResume = createAsyncThunk(
    'resume/updateResume',
    async ({ id, ...updates }: Partial<Resume> & { id: string }, { rejectWithValue }) => {
        try {
            const updatedResume: Resume = await api.put(`/api/resumes/${id}`, updates);
            return updatedResume;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update resume');
        }
    }
);

export const deleteResume = createAsyncThunk(
    'resume/deleteResume',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/api/resumes/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete resume');
        }
    }
);

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        setCurrentResume: (state, action: PayloadAction<Resume>) => {
            state.currentResume = action.payload;
        },
        updateResumeSection: (state, action: PayloadAction<{ sectionId: string; content: any }>) => {
            if (state.currentResume) {
                const section = state.currentResume.sections.find(s => s.id === action.payload.sectionId);
                if (section) {
                    section.content = action.payload.content;
                }
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchResumes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchResumes.fulfilled, (state, action: PayloadAction<Resume[]>) => {
                state.isLoading = false;
                state.resumes = action.payload;
            })
            .addCase(fetchResumes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch resumes';
            })
            .addCase(createResume.fulfilled, (state, action) => {
                toast.success('Resume created successfully!');
            })
            .addCase(updateResume.fulfilled, (state, action) => {
                toast.success('Resume updated successfully!');
            })
            .addCase(deleteResume.fulfilled, (state, action) => {
                toast.success('Resume deleted successfully!');
            });
    },
});

export const { setCurrentResume, updateResumeSection, clearError } = resumeSlice.actions;
export default resumeSlice.reducer; 