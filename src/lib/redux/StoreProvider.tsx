'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { setUnauthorizedHandler } from '@/lib/axios';
import { logout } from './slices/authSlice';
import { useEffect } from 'react';

export function StoreProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        setUnauthorizedHandler(() => {
            store.dispatch(logout());
        });
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
