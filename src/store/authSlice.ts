import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginCredentials, RegisterData } from '../types/auth';
import { api } from '../services/api';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Async thunks for authentication
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const data = await api.post('/api/auth/login', credentials);
            localStorage.setItem('token', data.token);
            const [firstName, ...rest] = data.user.name.split(' ');
            const lastName = rest.join(' ');
            return {
                id: data.user.id || data.user._id,
                email: data.user.email,
                firstName,
                lastName,
                role: data.user.role || 'professional',
                currentPosition: data.user.currentPosition,
                experience: data.user.experience,
                education: data.user.education,
                location: data.user.location,
                bio: data.user.bio,
                linkedin: data.user.linkedin,
                github: data.user.github,
                website: data.user.website,
                skills: [],
                interests: [],
                goals: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: RegisterData, { rejectWithValue }) => {
        try {
            const data = await api.post('/api/auth/register', {
                name: userData.firstName + ' ' + userData.lastName,
                email: userData.email,
                password: userData.password,
            });
            localStorage.setItem('token', data.token);
            const [firstName, ...rest] = data.user.name.split(' ');
            const lastName = rest.join(' ');
            return {
                id: data.user.id || data.user._id,
                email: data.user.email,
                firstName,
                lastName,
                role: userData.role,
                currentPosition: data.user.currentPosition,
                experience: data.user.experience,
                education: data.user.education,
                location: data.user.location,
                bio: data.user.bio,
                linkedin: data.user.linkedin,
                github: data.user.github,
                website: data.user.website,
                skills: [],
                interests: [],
                goals: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        // Simulate API call
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Login failed';
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Registration failed';
            })
            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, setUser, updateUser } = authSlice.actions;
export default authSlice.reducer; 