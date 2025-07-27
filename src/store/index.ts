import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import skillsReducer from './skillsSlice';
import learningPathReducer from './learningPathSlice';
import jobRolesReducer from './jobRolesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        skills: skillsReducer,
        learningPath: learningPathReducer,
        jobRoles: jobRolesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 