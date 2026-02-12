'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchMe } from '@/lib/redux/slices/authSlice';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://schoolapi.amroaltayeb14.workers.dev/graphql';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>();
    const queryClient = useQueryClient();
    const { isAuthenticated, loading, user, token } = useSelector((state: RootState) => state.auth);
    const role = user?.role;

    // Prefetching logic for critical routes
    useEffect(() => {
        if (isAuthenticated && role === 'admin' && token) {
            queryClient.prefetchQuery({
                queryKey: ['admin', 'dashboard', {}],
                queryFn: async () => {
                    const response = await axios.post(
                        API_BASE_URL,
                        {
                            query: `
                                query GetAdminDashboardData {
                                    adminDashboardStats {
                                        totalStudents
                                        totalTeachers
                                        totalClassRooms
                                    }
                                    topStudents {
                                        id
                                        userName
                                        email
                                        averageScore
                                        successRate
                                        class {
                                            name
                                        }
                                    }
                                }
                            `,
                            variables: {},
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    return response.data.data;
                },
                staleTime: 5 * 60 * 1000,
            });
        }
    }, [isAuthenticated, role, token, queryClient]);

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
                const isRestricted = pathname.includes('/admin'); // Completely block admin for student

                // Allow /dashboard and /profile for student (which are now shared under (portal))
                if (isRestricted) {
                    router.push('/dashboard');
                }
            }

            // Teacher restrictions
            if (role === 'teacher' && pathname.startsWith('/admin')) {
                router.push('/dashboard');
            }

            // Redirect from login/home based on role
            if (pathname === '/login' || pathname === '/') {
                if (role === 'admin') {
                    router.push('/admin');
                } else if (role === 'teacher' || role === 'student') {
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
