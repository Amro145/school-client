'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState } from '@/lib/redux/store';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If not authenticated and not loading, redirect to login
        if (!isAuthenticated && !loading && pathname !== '/login') {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router, pathname]);

    // Show nothing or a loader while determining auth status
    if (!isAuthenticated && pathname !== '/login') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
