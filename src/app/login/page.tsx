"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, GraduationCap, Users, Loader2 } from 'lucide-react';

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const role = searchParams.get('role') || 'student';
    const [loading, setLoading] = useState(false);

    const roleConfigs = {
        student: { title: "Student Login", icon: <GraduationCap className="w-10 h-10 text-blue-500" />, redirect: "/" },
        teacher: { title: "Teacher Login", icon: <Users className="w-10 h-10 text-purple-500" />, redirect: "/" },
        admin: { title: "Admin Portal", icon: <ShieldCheck className="w-10 h-10 text-green-500" />, redirect: "/admin" },
    };

    const config = roleConfigs[role as keyof typeof roleConfigs] || roleConfigs.student;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock authentication delay
        setTimeout(() => {
            router.push(config.redirect);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="mb-4">{config.icon}</div>
                    <h1 className="text-3xl font-bold text-slate-900">{config.title}</h1>
                    <p className="text-slate-500 mt-2">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="e.g. user@school.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
                    >
                        &larr; Back to selection
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
