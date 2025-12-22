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
    teacher: {
        id: string;
        userName: string;
    } | null;
    class: {
        id: string;
        name: string;
    } | null;
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
        subject?: {
            id: string;
            name: string;
        };
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

interface ClassRoom {
    id: string;
    name: string;
}

interface AdminState {
    stats: AdminDashboardStats | null;
    subjects: Subject[];
    students: Student[];
    totalStudentsCount: number;
    currentPage: number;
    teachers: Teacher[];
    classRooms: ClassRoom[];
    currentStudent: Student | null;
    loading: boolean;
    error: string | null;
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
    async (params: { page: number, limit: number, search?: string }, { rejectWithValue, getState, signal }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated to fetch students');
        }

        const offset = (params.page - 1) * params.limit;
        const query = `
      query MyQuery($limit: Int, $offset: Int, $search: String) {
        myStudents(limit: $limit, offset: $offset, search: $search) {
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
        totalStudentsCount
      }
    `;

        try {
            const response = await api.post('', {
                query,
                variables: {
                    limit: params.limit,
                    offset: offset,
                    search: params.search || ""
                }
            }, { signal });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return {
                students: response.data.data.myStudents,
                totalCount: response.data.data.totalStudentsCount,
                page: params.page
            };
        } catch (error: unknown) {
            if (axios.isCancel(error)) {
                return rejectWithValue('Request canceled');
            }
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

export const fetchSubjects = createAsyncThunk(
    'admin/fetchSubjects',
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated to fetch subjects');
        }

        const query = `
      query MyQuery {
        subjects {
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

            return response.data.data.subjects;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch subjects');
            }
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

        const query = `
      query MyQuery($id: Int!) {
        student(id: $id) {
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
            subject {
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
                variables: { id }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.student;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch student');
            }
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

        const query = `
      query MyQuery {
        classRooms {
          id
          name
        }
      }
    `;

        try {
            const response = await api.post('', { query });
            if (response.data.errors) return rejectWithValue(response.data.errors[0].message);
            return response.data.data.classRooms;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch class rooms');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const createNewUser = createAsyncThunk(
    'admin/createUser',
    async (userData: { userName: string, email: string, role: string, password: string, classId?: number }, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        const mutation = `
      mutation CreateUser($userName: String!, $email: String!, $role: String!, $password: String!, $classId: Int) {
        createUser(userName: $userName, email: $email, role: $role, password: $password, classId: $classId) {
          id
          userName
          email
          role
        }
      }
    `;

        try {
            const response = await api.post('', {
                query: mutation,
                variables: userData
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.createUser;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create user');
            }
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
            });
    },
});

export const { setPage } = adminSlice.actions;

export default adminSlice.reducer;
