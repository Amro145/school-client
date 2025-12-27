import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { RootState } from '../store';

// Types derived from the 'me' query structure
interface Student {
    id: string;
    userName: string;
    email: string;
}

interface Grade {
    id: string;
    score: number;
    student: Student;
}

interface ClassRoom {
    id: string;
    name: string;
}

export interface TeacherSubject {
    id: string;
    name: string;
    class: ClassRoom | null;
    grades: Grade[];
}

export interface TeacherProfile {
    id: string;
    userName: string;
    email: string;
    role: string;
    subjectsTaught: TeacherSubject[];
    schedules?: {
        id: string;
        day: string;
        startTime: string;
        endTime: string;
        subject: {
            id: string;
            name: string;
            teacher?: {
                id: string;
                userName: string;
            };
        };
        classRoom: {
            id: string;
            name: string;
        };
    }[];
}

interface TeacherState {
    currentTeacher: TeacherProfile | null;
    loading: boolean;
    error: string | null;
}

const initialState: TeacherState = {
    currentTeacher: null,
    loading: false,
    error: null,
};

export const fetchTeacherById = createAsyncThunk(
    'teacher/fetchTeacherById',
    async (id: string, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) return rejectWithValue('Not authenticated');

        const query = `
            query TeacherDetails($id: Int!) {
                teacher(id: $id) {
                    id
                    userName
                    email
                    role
                    subjectsTaught {
                        id
                        name
                        class {
                            id
                            name
                        }
                        grades {
                            id
                            score
                            student {
                                id
                                userName
                                email
                            }
                        }
                    }
                    schedules {
                        id
                        day
                        startTime
                        endTime
                        subject {
                            id
                            name
                        }
                        classRoom {
                            id
                            name
                        }
                    }
                }
            }
        `;

        try {
            const response = await api.post('', {
                query,
                variables: { id: parseInt(id) }
            });

            if (response.data.errors) return rejectWithValue(response.data.errors[0].message);
            return response.data.data.teacher;
        } catch (error: unknown) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

export const fetchTeacher = createAsyncThunk(
    'teacher/fetchTeacher',
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) return rejectWithValue('Not authenticated');

        const query = `
            query MyQuery {
              me {
                id
                userName
                email
                role
                subjectsTaught {
                  id
                  name
                  class {
                    id
                    name
                  }
                  grades {
                    id
                    score
                    student{
                      id
                      userName
                      email
                    }
                  }
                }
                schedules {
                  id
                  day
                  startTime
                  endTime
                  subject {
                    id
                    name
                  }
                  classRoom {
                    id
                    name
                  }
                }
              }
            }
        `;

        try {
            const response = await api.post('', { query });

            if (response.data.errors) return rejectWithValue(response.data.errors[0].message);
            return response.data.data.me;
        } catch (error: unknown) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

export const updateSubjectGrades = createAsyncThunk(
    'teacher/updateSubjectGrades',
    async (grades: { id: string; score: number }[], { rejectWithValue }) => {
        const mutation = `
            mutation UpdateGrades($grades: [GradeUpdateInput!]!) {
                updateBulkGrades(grades: $grades) {
                    id
                    score
                }
            }
        `;

        try {
            const response = await api.post('', {
                query: mutation,
                variables: { grades }
            });

            if (response.data.errors) return rejectWithValue(response.data.errors[0].message);
            return response.data.data.updateBulkGrades;
        } catch (error: unknown) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
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
            })
            .addCase(fetchTeacherById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTeacher = action.payload;
            })
            .addCase(fetchTeacherById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchTeacher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeacher.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTeacher = action.payload;
            })
            .addCase(fetchTeacher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateSubjectGrades.fulfilled, (state, action) => {
                if (state.currentTeacher) {
                    // Update the local state to match the returned score updates
                    // This avoids a full re-fetch after saving
                    const updatedGrades = action.payload as { id: string; score: number }[];

                    state.currentTeacher.subjectsTaught.forEach(subject => {
                        subject.grades.forEach(grade => {
                            const update = updatedGrades.find(u => u.id === grade.id);
                            if (update) {
                                grade.score = update.score;
                            }
                        });
                    });
                }
            });
    }
});

export const { resetTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;
