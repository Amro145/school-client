import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import authReducer from './slices/authSlice';
import subjectReducer from './slices/subjectSlice';
import teacherReducer from './slices/teacherSlice';

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        auth: authReducer,
        subject: subjectReducer,
        teacher: teacherReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
