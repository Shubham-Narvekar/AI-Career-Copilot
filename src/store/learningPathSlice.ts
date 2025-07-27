import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LearningPath } from '../types/learningPath';
import { api } from '../services/api';
import { toast } from 'react-toastify';

interface LearningPathState {
    paths: LearningPath[];
    isLoading: boolean;
    error: string | null;
}

const initialState: LearningPathState = {
    paths: [],
    isLoading: false,
    error: null,
};

export const fetchLearningPaths = createAsyncThunk(
    'learningPath/fetchLearningPaths',
    async (_, { rejectWithValue }) => {
        try {
            const paths: LearningPath[] = await api.get('/api/learning-paths');
            return paths;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch learning paths');
        }
    }
);

export const createLearningPath = createAsyncThunk(
    'learningPath/createLearningPath',
    async (path: Partial<LearningPath>, { rejectWithValue }) => {
        try {
            const newPath: LearningPath = await api.post('/api/learning-paths', path);
            return newPath;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create learning path');
        }
    }
);

export const updateLearningPath = createAsyncThunk(
    'learningPath/updateLearningPath',
    async ({ id, ...updates }: Partial<LearningPath> & { id: string }, { rejectWithValue }) => {
        try {
            const updatedPath: LearningPath = await api.put(`/api/learning-paths/${id}`, updates);
            return updatedPath;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update learning path');
        }
    }
);

export const deleteLearningPath = createAsyncThunk(
    'learningPath/deleteLearningPath',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/api/learning-paths/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete learning path');
        }
    }
);

const learningPathSlice = createSlice({
    name: 'learningPath',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLearningPaths.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLearningPaths.fulfilled, (state, action: PayloadAction<LearningPath[]>) => {
                state.isLoading = false;
                state.paths = action.payload;
            })
            .addCase(fetchLearningPaths.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch learning paths';
            })
            .addCase(createLearningPath.fulfilled, (state, action) => {
                toast.success('Learning path created successfully!');
            })
            .addCase(updateLearningPath.fulfilled, (state, action) => {
                toast.success('Learning path updated successfully!');
            })
            .addCase(deleteLearningPath.fulfilled, (state, action) => {
                toast.success('Learning path deleted successfully!');
            });
    },
});

export default learningPathSlice.reducer; 