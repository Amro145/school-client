import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import authReducer from './slices/authSlice';
import subjectReducer from './slices/subjectSlice';

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        auth: authReducer,
        subject: subjectReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
