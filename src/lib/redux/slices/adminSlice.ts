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
    async (userData: { userName: string, email: string, role: string, password: string, classId?: number | string }, { rejectWithValue, getState }) => {
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
                variables: {
                    userName: userData.userName,
                    email: userData.email,
                    role: userData.role,
                    password: userData.password,
                    classId: userData.classId ? Number(userData.classId) : undefined
                }
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

export const createNewSubject = createAsyncThunk(
    'admin/createSubject',
    async (subjectData: { classId: number, name: string, teacherId: number }, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        const mutation = `
      mutation CreateSubject($classId: Int!, $name: String!, $teacherId: Int!) {
        createSubject(classId: $classId, name: $name, teacherId: $teacherId) {
          id
        }
      }
    `;

        try {
            const response = await api.post('', {
                query: mutation,
                variables: {
                    classId: Number(subjectData.classId),
                    teacherId: Number(subjectData.teacherId),
                    name: subjectData.name
                }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.createSubject;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create subject');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const createNewTeacher = createAsyncThunk(
    'admin/createTeacher',
    async (teacherData: { userName: string, email: string, password: string }, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        const mutation = `
      mutation CreateUser($userName: String!, $email: String!, $role: String!, $password: String!) {
        createUser(userName: $userName, email: $email, role: $role, password: $password) {
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
                variables: {
                    userName: teacherData.userName,
                    email: teacherData.email,
                    password: teacherData.password,
                    role: 'teacher'
                }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.createUser;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create teacher');
            }
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

        const mutation = `
      mutation CreateSchool($name: String!) {
        createSchool(name: $name) {
          id
          name
        }
      }
    `;

        try {
            const response = await api.post('', {
                query: mutation,
                variables: { name }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.createSchool;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create school');
            }
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

        const mutation = `
      mutation DeleteUser($id: Int!) {
        deleteUser(id: $id) {
          id
        }
      }
    `;

        try {
            const response = await api.post('', {
                query: mutation,
                variables: { id: typeof id === 'string' ? parseInt(id) : id }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return id;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete user');
            }
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

        const mutation = `
      mutation DeleteClassRoom($id: Int!) {
        deleteClassRoom(id: $id) {
          id
        }
      }
    `;

        try {
            const response = await api.post('', {
                query: mutation,
                variables: { id: typeof id === 'string' ? parseInt(id) : id }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return id;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete classroom');
            }
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

        const mutation = `
      mutation DeleteSubject($id: Int!) {
        deleteSubject(id: $id) {
          id
        }
      }
    `;

        try {
            const response = await api.post('', {
                query: mutation,
                variables: { id: typeof id === 'string' ? parseInt(id) : id }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return id;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete subject');
            }
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

export const createNewClassRoom = createAsyncThunk(
    'admin/createClassRoom',
    async (name: string, { rejectWithValue, getState }) => {
        const { auth } = getState() as RootState;
        if (!auth.isAuthenticated) {
            return rejectWithValue('User must be authenticated');
        }

        const mutation = `
      mutation CreateClassRoom($name: String!, $schoolId: Int) {
        createClassRoom(name: $name, schoolId: $schoolId) {
          id
          name
        }
      }
    `;

        try {
            const response = await api.post('', {
                query: mutation,
                variables: {
                    name,
                    schoolId: auth.user?.schoolId ? Number(auth.user.schoolId) : undefined
                }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.createClassRoom;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create class room');
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
            // Create Teacher
            .addCase(createNewTeacher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewTeacher.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createNewTeacher.rejected, (state, action) => {
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

                // Identify if it was a student before filtering
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
            });
    },
});

export const { setPage } = adminSlice.actions;

export default adminSlice.reducer;
