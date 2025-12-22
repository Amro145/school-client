import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import axios from 'axios';
import { RootState } from '../store';

interface Student {
    id: number;
    userName: string;
    email: string;
}

interface Grade {
    id: number;
    student: Student;
    score: number;
}

interface SubjectTaught {
    id: number;
    name: string;
    grades: Grade[];
}

interface TeacherDetail {
    id: number;
    userName: string;
    email: string;
    role: string;
    subjectsTaught: SubjectTaught[];
}

interface TeacherState {
    currentTeacher: TeacherDetail | null;
    loading: boolean;
    error: string | null;
}

const initialState: TeacherState = {
    currentTeacher: null,
    loading: false,
    error: null,
};

export const fetchTeacherById = createAsyncThunk(
    'teacher/fetchById',
    async (teacherId: string, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated to fetch teacher details');
        }

        const query = `
      query MyQuery($id: Int!) {
        teacher(id: $id) {
          id
          userName
          email
          role
          subjectsTaught {
            id
            name
            grades {
              id
              student {
                id
                userName
                email
              }
              score
            }
          }
        }
      }
    `;

        try {
            const response = await api.post('', {
                query,
                variables: { id: parseInt(teacherId) }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.teacher;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch teacher details');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        resetTeacher: (state) => {
            state.currentTeacher = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeacherById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentTeacher = null;
            })
            .addCase(fetchTeacherById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTeacher = action.payload;
            })
            .addCase(fetchTeacherById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            });
    },
});

export const { resetTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;
