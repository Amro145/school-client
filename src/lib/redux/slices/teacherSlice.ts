import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { RootState } from '../store';

interface StudentGrade {
    id: string;
    score: number;
    student: {
        id: string;
        userName: string;
        email: string;
    };
}

interface SubjectDetail {
    id: string;
    name: string;
    class: {
        id: string;
        name: string;
    } | null;
    grades: StudentGrade[];
}

interface TeacherDetail {
    id: string;
    userName: string;
    email: string;
    role: string;
    subjectsTaught: SubjectDetail[];
}

interface StudentPerformance {
    id: string;
    userName: string;
    email: string;
    class: {
        name: string;
    } | null;
    grades: {
        id: string;
        score: number;
        subject: {
            id: string;
            name: string;
            teacher: {
                id: string;
            } | null;
        };
    }[];
}

interface TeacherState {
    currentTeacher: TeacherDetail | null;
    currentSubject: SubjectDetail | null;
    currentStudent: StudentPerformance | null;
    loading: boolean;
    error: string | null;
}

const initialState: TeacherState = {
    currentTeacher: null,
    currentSubject: null,
    currentStudent: null,
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

export const fetchSubjectDetails = createAsyncThunk(
    'teacher/fetchSubjectDetails',
    async (subjectId: string, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) return rejectWithValue('Not authenticated');

        const query = `
            query SubjectDetails($id: Int!) {
                subject(id: $id) {
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
            }
        `;

        try {
            const response = await api.post('', {
                query,
                variables: { id: parseInt(subjectId) }
            });

            if (response.data.errors) return rejectWithValue(response.data.errors[0].message);
            return response.data.data.subject;
        } catch (error: unknown) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

export const fetchStudentPerformance = createAsyncThunk(
    'teacher/fetchStudentPerformance',
    async (studentId: string, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) return rejectWithValue('Not authenticated');

        const query = `
            query StudentPerformance($id: Int!) {
                student(id: $id) {
                    id
                    userName
                    email
                    class {
                        name
                    }
                    grades {
                        id
                        score
                        subject {
                            id
                            name
                            teacher {
                                id
                            }
                        }
                    }
                }
            }
        `;

        try {
            const response = await api.post('', {
                query,
                variables: { id: parseInt(studentId) }
            });

            if (response.data.errors) return rejectWithValue(response.data.errors[0].message);
            return response.data.data.student;
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
            .addCase(fetchSubjectDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubjectDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSubject = action.payload;
            })
            .addCase(fetchSubjectDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchStudentPerformance.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentStudent = null;
            })
            .addCase(fetchStudentPerformance.fulfilled, (state, action) => {
                state.loading = false;
                state.currentStudent = action.payload;
            })
            .addCase(fetchStudentPerformance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { resetTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;
