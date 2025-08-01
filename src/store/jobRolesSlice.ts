import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { JobRole, JobRecommendationState, JobRecommendationFilters } from '../types/jobRoles';
import { api } from '../services/api';
import { RootState } from './index';

const initialState: JobRecommendationState = {
    recommendations: [],
    savedJobs: [],
    appliedJobs: [],
    filters: {
        location: [],
        experience: [],
        salary: { min: 0, max: 200000 },
        jobType: [],
        industry: [],
        skills: []
    },
    isLoading: false,
    error: null,
    totalResults: 0,
    currentPage: 1,
    itemsPerPage: 10
};

export const fetchJobRecommendations = createAsyncThunk(
    'jobRoles/fetchRecommendations',
    async (filters: JobRecommendationFilters, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const userId = state.auth.user?.id;
            
            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Fetch AI-powered job recommendations
            const jobs: JobRole[] = await api.get(`/api/job-roles/recommend/${userId}`);
            
            // Apply frontend filters if needed
            let filteredJobs = jobs;
            
            if (filters.experience.length > 0) {
                filteredJobs = filteredJobs.filter(job => 
                    filters.experience.includes(job.experience)
                );
            }
            
            if (filters.jobType.length > 0) {
                filteredJobs = filteredJobs.filter(job => 
                    filters.jobType.includes(job.type)
                );
            }
            
            if (filters.salary.min > 0 || filters.salary.max < 200000) {
                filteredJobs = filteredJobs.filter(job => {
                    const avgSalary = (job.salary.min + job.salary.max) / 2;
                    return avgSalary >= filters.salary.min && avgSalary <= filters.salary.max;
                });
            }
            
            return filteredJobs;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch job recommendations');
        }
    }
);

export const saveJob = createAsyncThunk(
    'jobRoles/saveJob',
    async (jobId: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return jobId;
    }
);

export const applyToJob = createAsyncThunk(
    'jobRoles/applyToJob',
    async (jobId: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return jobId;
    }
);

export const fetchRecommendedJobs = createAsyncThunk(
    'jobRoles/fetchRecommendedJobs',
    async (userId: string, { rejectWithValue }) => {
        try {
            const jobs: JobRole[] = await api.get(`/api/job-roles/recommend/${userId}`);
            return jobs;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch recommended jobs');
        }
    }
);

const jobRolesSlice = createSlice({
    name: 'jobRoles',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<JobRecommendationFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        toggleJobSaved: (state, action: PayloadAction<string>) => {
            const job = state.recommendations.find(j => j.id === action.payload);
            if (job) {
                job.isSaved = !job.isSaved;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobRecommendations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchJobRecommendations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.recommendations = action.payload;
                state.totalResults = action.payload.length;
            })
            .addCase(fetchJobRecommendations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch job recommendations';
            })
            .addCase(saveJob.fulfilled, (state, action) => {
                const job = state.recommendations.find(j => j.id === action.payload);
                if (job) {
                    job.isSaved = true;
                    state.savedJobs.push(job);
                }
            })
            .addCase(applyToJob.fulfilled, (state, action) => {
                const job = state.recommendations.find(j => j.id === action.payload);
                if (job) {
                    job.isApplied = true;
                    state.appliedJobs.push(job);
                }
            })
            .addCase(fetchRecommendedJobs.fulfilled, (state, action) => {
                state.recommendations = action.payload;
                state.totalResults = action.payload.length;
            })
            .addCase(fetchRecommendedJobs.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch recommended jobs';
            });
    }
});

export const { setFilters, clearFilters, setCurrentPage, toggleJobSaved } = jobRolesSlice.actions;
export default jobRolesSlice.reducer; 