import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import axios from 'axios';
import { RootState } from '../store';

interface Teacher {
    id: string;
    userName: string;
}

interface ClassRoom {
    id: string;
    name: string;
}

interface Student {
    id: string;
    userName: string;
}

interface Grade {
    id: string;
    student: Student;
    score: number;
}

interface SubjectDetail {
    id: string;
    name: string;
    teacher: Teacher;
    class: ClassRoom;
    grades: Grade[];
}

interface SubjectState {
    currentSubject: SubjectDetail | null;
    loading: boolean;
    error: string | null;
}

const initialState: SubjectState = {
    currentSubject: null,
    loading: false,
    error: null,
};

export const fetchSubjectById = createAsyncThunk(
    'subject/fetchById',
    async (subjectId: string, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated to fetch subject details');
        }

        const query = `
      query MyQuery($id: Int!) {
        subject(id: $id) {
          id
          name
          teacher {
            id
            userName
          }
          class {
            id
            name
          }
          grades {
            id
            student {
              id
              userName
            }
            score
          }
        }
      }
    `;

        try {
            const response = await api.post('', {
                query,
                variables: { id: parseInt(subjectId) }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.subject;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch subject details');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const updateGradesBulk = createAsyncThunk(
    'subject/updateGradesBulk',
    async (grades: { id: string | number, score: number }[], { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        const mutation = `
      mutation updateBulkGrades($grades: [GradeUpdateInput!]!) {
        updateBulkGrades(grades: $grades) {
          id
          score
        }
      }
    `;

        try {
            const response = await api.post('', {
                query: mutation,
                variables: {
                    grades: grades.map(g => ({
                        id: g.id.toString(),
                        score: g.score
                    }))
                }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.updateBulkGrades;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update grades');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        resetSubject: (state) => {
            state.currentSubject = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentSubject = null;
            })
            .addCase(fetchSubjectById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSubject = action.payload;
            })
            .addCase(fetchSubjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            .addCase(updateGradesBulk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGradesBulk.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentSubject) {
                    const updatedGrades = action.payload as { id: string, score: number }[];
                    state.currentSubject.grades = state.currentSubject.grades.map(grade => {
                        const updated = updatedGrades.find(u => u.id.toString() === grade.id.toString());
                        return updated ? { ...grade, score: updated.score } : grade;
                    });
                }
            })
            .addCase(updateGradesBulk.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            });
    },
});

export const { resetSubject } = subjectSlice.actions;
export default subjectSlice.reducer;
