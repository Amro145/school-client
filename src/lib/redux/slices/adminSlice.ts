import { createSlice } from '@reduxjs/toolkit';

interface AdminState {
    currentPage: number;
    isAutoSaveEnabled: boolean;
}

const initialState: AdminState = {
    currentPage: 1,
    isAutoSaveEnabled: true,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
        toggleAutoSave: (state) => {
            state.isAutoSaveEnabled = !state.isAutoSaveEnabled;
        },
        setAutoSave: (state, action) => {
            state.isAutoSaveEnabled = action.payload;
        }
    }
});

export const { setPage, toggleAutoSave, setAutoSave } = adminSlice.actions;

export default adminSlice.reducer;
