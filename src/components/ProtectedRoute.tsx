'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchMe } from '@/lib/redux/slices/authSlice';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, loading, user, token } = useSelector((state: RootState) => state.auth);
    const role = user?.role;

    useEffect(() => {
        if (token && !user && !loading) {
            dispatch(fetchMe());
        }
    }, [token, user, loading, dispatch]);

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            if (pathname !== '/login' && pathname !== '/') {
                router.push('/login');
            }
        } else {
            // Student restrictions
            if (role === 'student') {
                const isRestricted = pathname.includes('/admin/subjects') ||
                    pathname.includes('/admin/teachers') ||
                    pathname.includes('/admin/classes');

                if (isRestricted) {
                    router.push('/admin'); // Redirect to dashboard
                }
            }

            // Teacher restrictions
            if (role === 'teacher' && pathname.startsWith('/admin')) {
                router.push('/dashboard');
            }

            if (pathname === '/login' || pathname === '/') {
                if (role === 'admin' || role === 'student') {
                    router.push('/admin');
                } else if (role === 'teacher') {
                    router.push('/dashboard');
                }
            }
        }
    }, [isAuthenticated, loading, router, pathname, role]);

    if (loading || (!isAuthenticated && pathname !== '/login' && pathname !== '/')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
