import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import authReducer from './slices/authSlice';
import subjectReducer from './slices/subjectSlice';
import teacherReducer from './slices/teacherSlice';
import examReducer from './slices/examSlice';

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        auth: authReducer,
        subject: subjectReducer,
        teacher: teacherReducer,
        exam: examReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
