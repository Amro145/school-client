import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import axios from 'axios';
import { RootState } from '../store';

interface AdminDashboardStats {
    totalStudents: number;
    totalTeachers: number;
    totalClassRooms: number;
}

interface Subject {
    id: string;
    name: string;
    grades: {
        id: string;
        score: number;
    }[];
}

interface Student {
    id: string;
    userName: string;
    email: string;
    role: string;
    class: {
        id: string;
        name: string;
    } | null;
    grades: {
        id: string;
        score: number;
    }[];
}

interface Teacher {
    id: string;
    userName: string;
    email: string;
    role: string;
    subjectsTaught: {
        id: string;
        name: string;
        grades: {
            id: string;
            score: number;
        }[];
    }[];
}

interface AdminState {
    stats: AdminDashboardStats | null;
    subjects: Subject[];
    students: Student[];
    teachers: Teacher[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    stats: null,
    subjects: [],
    students: [],
    teachers: [],
    loading: false,
    error: null,
};

export const fetchAdminDashboardData = createAsyncThunk(
    'admin/fetchDashboardData',
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated to fetch admin data');
        }

        const query = `
      query MyQuery {
        adminDashboardStats {
          totalStudents
          totalTeachers
          totalClassRooms
        }
        subjects {
          id
          name
          grades {
            id
            score
          }
        }
      }
    `;

        try {
            const response = await api.post('', { query });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch data');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchMyStudents = createAsyncThunk(
    'admin/fetchMyStudents',
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated to fetch students');
        }

        const query = `
      query MyQuery {
        myStudents {
          id
          userName
          email
          role
          class {
            id
            name
          }
          grades {
            id
            score
          }
        }
      }
    `;

        try {
            const response = await api.post('', { query });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.myStudents;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch students');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchMyTeachers = createAsyncThunk(
    'admin/fetchMyTeachers',
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated to fetch teachers');
        }

        const query = `
      query MyQuery {
        myTeachers {
          id
          userName
          email
          role
          subjectsTaught {
            id
            name
            grades {
              id
              score
            }
          }
        }
      }
    `;

        try {
            const response = await api.post('', { query });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.myTeachers;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch teachers');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Dashboard Data
            .addCase(fetchAdminDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.adminDashboardStats;
                state.subjects = action.payload.subjects;
            })
            .addCase(fetchAdminDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Students Data
            .addCase(fetchMyStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchMyStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Teachers Data
            .addCase(fetchMyTeachers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyTeachers.fulfilled, (state, action) => {
                state.loading = false;
                state.teachers = action.payload;
            })
            .addCase(fetchMyTeachers.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            });
    },
});

export default adminSlice.reducer;
