import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { dashboardService } from '@/services/dashboard-service';
import { studentService } from '@/services/student-service';
import { teacherService } from '@/services/teacher-service';
import { subjectService } from '@/services/subject-service';
import { classService } from '@/services/class-service';
import { userService } from '@/services/user-service';
import {
    AdminDashboardStats,
    Subject,
    Student,
    Teacher,
    ClassRoom
} from '@/types/admin';

interface AdminState {
    stats: AdminDashboardStats | null;
    subjects: Subject[];
    students: Student[];
    totalStudentsCount: number;
    currentPage: number;
    teachers: Teacher[];
    classRooms: ClassRoom[];
    currentStudent: Student | null;
    topStudents: Student[];
    loading: boolean;
    error: string | null;
    isAutoSaveEnabled: boolean;
    currentClass: (ClassRoom & { students: Student[]; subjects: Subject[] }) | null;
}

const initialState: AdminState = {
    stats: null,
    subjects: [],
    students: [],
    totalStudentsCount: 0,
    currentPage: 1,
    teachers: [],
    classRooms: [],
    currentStudent: null,
    topStudents: [],
    loading: false,
    error: null,
    isAutoSaveEnabled: true,
    currentClass: null,
};

export const fetchAdminDashboardData = createAsyncThunk(
    'admin/fetchDashboardData',
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated to fetch admin data');
        }

        try {
            return await dashboardService.getStats();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch data');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchMyStudents = createAsyncThunk(
    'admin/fetchMyStudents',
    async (params: { page: number, limit: number, search?: string }, { rejectWithValue, getState, signal }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated to fetch students');
        }

        const offset = (params.page - 1) * params.limit;

        try {
            const { students, totalCount } = await studentService.getMyStudents({
                limit: params.limit,
                offset: offset,
                search: params.search
            }, signal);

            return {
                students,
                totalCount,
                page: params.page
            };
        } catch (error: unknown) {
            if (axios.isCancel(error)) {
                return rejectWithValue('Request canceled');
            }
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch students');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
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

        try {
            return await teacherService.getMyTeachers();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch teachers');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchSubjects = createAsyncThunk(
    'admin/fetchSubjects',
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated to fetch subjects');
        }

        try {
            return await subjectService.getSubjects();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch subjects');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchStudentById = createAsyncThunk(
    'admin/fetchStudentById',
    async (id: number, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated to fetch student details');
        }

        try {
            return await studentService.getStudentById(id);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch student');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchClassRooms = createAsyncThunk(
    'admin/fetchClassRooms',
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        try {
            return await classService.getClassRooms();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch class rooms');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchClassById = createAsyncThunk(
    'admin/fetchClassById',
    async (id: number, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        try {
            return await classService.getClassById(id);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch class details');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const createNewUser = createAsyncThunk(
    'admin/createUser',
    async (userData: { userName: string, email: string, role: string, password: string, classId?: number | string }, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        try {
            return await userService.createUser(userData);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create user');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const createNewSubject = createAsyncThunk(
    'admin/createSubject',
    async (subjectData: { classId: number, name: string, teacherId: number }, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        try {
            return await subjectService.createSubject(subjectData);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create subject');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const createNewSchool = createAsyncThunk(
    'admin/createSchool',
    async (name: string, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        try {
            return await classService.createSchool(name);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create school');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const handleDeleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id: string | number, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        try {
            return await userService.deleteUser(id);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete user');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const handleDeleteClassRoom = createAsyncThunk(
    'admin/deleteClassRoom',
    async (id: string | number, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        try {
            return await classService.deleteClassRoom(id);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete classroom');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const handleDeleteSubject = createAsyncThunk(
    'admin/deleteSubject',
    async (id: string | number, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        try {
            return await subjectService.deleteSubject(id);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete subject');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const updateGradesBulk = createAsyncThunk(
    'admin/updateGradesBulk',
    async (grades: { id: string | number, score: number }[], { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        try {
            return await studentService.updateGradesBulk(grades);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update grades');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const createNewClassRoom = createAsyncThunk(
    'admin/createClassRoom',
    async (name: string, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        try {
            return await classService.createClassRoom(name, auth.user?.schoolId ? Number(auth.user.schoolId) : undefined);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create class room');
            }
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
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
            // Side effect: persistence is handled by the component invoking this or middleware, 
            // but here we just update state. Ideally, effects belong elsewhere, 
            // but for simplicity we rely on the UI to sync to localStorage if needed, 
            // or the component initializing it.
        },
        setAutoSave: (state, action) => {
            state.isAutoSaveEnabled = action.payload;
        }
    },
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
                state.topStudents = action.payload.topStudents;
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
                state.students = action.payload.students;
                state.totalStudentsCount = action.payload.totalCount;
                state.currentPage = action.payload.page;
            })
            .addCase(fetchMyStudents.rejected, (state, action) => {
                if (action.payload === 'Request canceled') return;
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
            })
            // Subjects Data
            .addCase(fetchSubjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.loading = false;
                state.subjects = action.payload;
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Student Profile Data
            .addCase(fetchStudentById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentStudent = null;
            })
            .addCase(fetchStudentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentStudent = action.payload;
            })
            .addCase(fetchStudentById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // ClassRooms Data
            .addCase(fetchClassRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.classRooms = action.payload;
            })
            .addCase(fetchClassRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Create User
            .addCase(createNewUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createNewUser.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Create Subject
            .addCase(createNewSubject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewSubject.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createNewSubject.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Create School
            .addCase(createNewSchool.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewSchool.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createNewSchool.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Delete User
            .addCase(handleDeleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleDeleteUser.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload.toString();

                const wasStudent = state.students.some(s => s.id.toString() === deletedId);
                const wasTeacher = state.teachers.some(t => t.id.toString() === deletedId);

                state.students = state.students.filter(student => student.id.toString() !== deletedId);
                state.teachers = state.teachers.filter(teacher => teacher.id.toString() !== deletedId);

                if (wasStudent) {
                    state.totalStudentsCount = Math.max(0, state.totalStudentsCount - 1);
                    if (state.stats) {
                        state.stats.totalStudents = Math.max(0, state.stats.totalStudents - 1);
                    }
                }

                if (wasTeacher && state.stats) {
                    state.stats.totalTeachers = Math.max(0, state.stats.totalTeachers - 1);
                }
            })
            .addCase(handleDeleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Delete ClassRoom
            .addCase(handleDeleteClassRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleDeleteClassRoom.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload.toString();
                state.classRooms = state.classRooms.filter(c => c.id.toString() !== deletedId);

                if (state.stats) {
                    state.stats.totalClassRooms = Math.max(0, state.stats.totalClassRooms - 1);
                }
            })
            .addCase(handleDeleteClassRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Delete Subject
            .addCase(handleDeleteSubject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleDeleteSubject.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload.toString();
                state.subjects = state.subjects.filter(s => s.id.toString() !== deletedId);
            })
            .addCase(handleDeleteSubject.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Update Bulk Grades
            .addCase(updateGradesBulk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGradesBulk.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentStudent) {
                    const updatedGrades = action.payload as { id: string, score: number }[];
                    state.currentStudent.grades = state.currentStudent.grades.map(grade => {
                        const updated = updatedGrades.find(u => u.id.toString() === grade.id.toString());
                        return updated ? { ...grade, score: updated.score } : grade;
                    });
                }
            })
            .addCase(updateGradesBulk.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Create New ClassRoom
            .addCase(createNewClassRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewClassRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.classRooms.push(action.payload);
            })
            .addCase(createNewClassRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })
            // Fetch Class By Id
            .addCase(fetchClassById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentClass = null;
            })
            .addCase(fetchClassById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentClass = action.payload;
            })
            .addCase(fetchClassById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            });

    },
});

export const { setPage, toggleAutoSave, setAutoSave } = adminSlice.actions;

export default adminSlice.reducer;
