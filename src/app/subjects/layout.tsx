'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import AdminLayout from '@/app/admin/layout';
import TeacherLayout from '@/app/(portal)/layout';
import { Loader2 } from 'lucide-react';

export default function SubjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useSelector((state: RootState) => state.auth);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (user?.role === 'teacher') {
        return <TeacherLayout>{children}</TeacherLayout>;
    }

    // Default to Admin Layout for Admin and others (or fallback)
    return <AdminLayout>{children}</AdminLayout>;
}
