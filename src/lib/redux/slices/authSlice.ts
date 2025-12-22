import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import Cookies from 'js-cookie';

interface User {
    id: string;
    email: string;
    userName: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: Cookies.get('auth_token') || null,
    loading: false,
    error: null,
    isAuthenticated: !!Cookies.get('auth_token'),
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }: any, { rejectWithValue }) => {
        const mutation = `
      mutation {
        login(email: "${email}", password: "${password}") {
          token
          user {
            id
            email
            userName
            role
          }
        }
      }
    `;

        try {
            const response = await api.post('', { query: mutation });

            if (response.data.errors) {
                return rejectWithValue(response.data.errors[0].message);
            }

            const { token, user } = response.data.data.login;

            // Store token in cookie (expires in 7 days)
            Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'strict' });

            return { token, user };
        } catch (error: any) {
            if (error.response?.data?.errors) {
                return rejectWithValue(error.response.data.errors[0].message);
            }
            return rejectWithValue(error.message || 'Login failed');
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
            Cookies.remove('auth_token');
        },
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
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
