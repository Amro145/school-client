'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState } from '@/lib/redux/store';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const pathname = usePathname();
    const role = user?.role;

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            if (pathname !== '/login' && pathname !== '/') {
                router.push('/login');
            }
        } else {
            if (pathname === '/login' || pathname === '/') {
                if (role === 'admin') {
                    router.push('/admin');
                } else if (role === 'teacher') {
                    router.push('/teacher');
                } else {
                    router.push('/student');
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
