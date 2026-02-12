'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { setUnauthorizedHandler } from '@/lib/axios';
import { logout, fetchMe } from './slices/authSlice';
import { useEffect } from 'react';

export function StoreProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        setUnauthorizedHandler(() => {
            store.dispatch(logout());
        });

        // Initialize user if token exists but no user in state
        const token = store.getState().auth.token;
        const user = store.getState().auth.user;
        if (token && !user) {
            // @ts-ignore - thunk typing
            store.dispatch(fetchMe());
        }
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
