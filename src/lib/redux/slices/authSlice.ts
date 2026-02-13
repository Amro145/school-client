import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import Cookies from 'js-cookie';

interface User {
    id: number | string;
    email: string;
    userName: string;
    role: string;
    schoolId: number | string | null;
    averageScore?: number;
    finalAverageScore?: number;
    midtermAverageScore?: number;
    quizAverageScore?: number;
    successRate?: number;
    subjectsTaught?: {
        id: number | string;
        name: string;
        successRate: number;
        class: {
            id: number | string;
            name: string;
        } | null;
    }[];
    class?: {
        id: number | string;
        name: string;
        subjects: {
            id: number | string;
            name: string;
        }[];
    } | null;
    grades?: {
        id: number | string;
        score: number;
        subject: {
            id: number | string;
            name: string;
        };
        type: string;
    }[];
    schedules?: {
        id: number | string;
        day: string;
        startTime: string;
        endTime: string;
        subject: {
            id: number | string;
            name: string;
            teacher?: {
                id: number | string;
                userName: string;
            };
        };
        classRoom: {
            id: number | string;
            name: string;
        };
    }[];
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    needsSchoolSetup: boolean;
}

const initialState: AuthState = {
    user: null,
    token: Cookies.get('auth_token') || null,
    loading: false,
    error: null,
    isAuthenticated: !!Cookies.get('auth_token'),
    needsSchoolSetup: false,
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }: Record<string, string>, { rejectWithValue }) => {
        const query = `
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            email
            userName
            role
            schoolId
          }
        }
      }
    `;

        try {
            // 1. Clear any existing token before executing login
            Cookies.remove('auth_token');

            const response = await api.post('', {
                query,
                variables: { email, password }
            });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            const { token, user } = response.data.data.login;

            // 2. Save new token to Cookies only (single source of truth)
            Cookies.set('auth_token', token, {
                expires: 7,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            return { token, user };
        } catch (error: any) {
            if (error.response) {
                return rejectWithValue(error.response.data?.errors?.[0]?.message || error.response.data?.message || 'Login failed');
            }
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const fetchMe = createAsyncThunk(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        const query = `
      query Me {
        me {
          id
          averageScore
          finalAverageScore
          midtermAverageScore
          quizAverageScore
          successRate
          userName
          email
          role
          schoolId
          class {
            id
            name
            subjects {
              id
              name
            }
          }
          grades {
            id
            score
            subject {
              id
              name
            }
            type
          }
          subjectsTaught {
            id
            name
            successRate
            class {
                id
                name
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
              teacher {
                id
                userName
              }
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

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            return response.data.data.me;
        } catch (error: any) {
            if (error.response) {
                return rejectWithValue(error.response.data?.errors?.[0]?.message || error.response.data?.message || 'Failed to fetch user');
            }
            return rejectWithValue(error.message || 'An unexpected error occurred');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.needsSchoolSetup = false;
            Cookies.remove('auth_token');
        },
        setSchoolId: (state, action) => {
            if (state.user) {
                state.user.schoolId = action.payload;
                state.needsSchoolSetup = false;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.needsSchoolSetup = action.payload.user.role === 'admin' && action.payload.user.schoolId === null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Me
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
                state.needsSchoolSetup = action.payload?.role === 'admin' && action.payload?.schoolId === null;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                Cookies.remove('auth_token');
            });
    },
});

export const { logout, setSchoolId } = authSlice.actions;
export default authSlice.reducer;
