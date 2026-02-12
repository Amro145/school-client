import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@/services/user-service';

interface AdminState {
    currentPage: number;
    isAutoSaveEnabled: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    currentPage: 1,
    isAutoSaveEnabled: true,
    loading: false,
    error: null,
};

export const handleDeleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id: string | number, { rejectWithValue }) => {
        try {
            await userService.deleteUser(String(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

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
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleDeleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleDeleteUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(handleDeleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setPage, toggleAutoSave, setAutoSave } = adminSlice.actions;

export default adminSlice.reducer;
