'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Copy, Check, ArrowLeft, ShieldCheck, Users, GraduationCap as StudentIcon } from 'lucide-react';

const GUEST_ACCOUNTS = [
    {
        role: "Admin",
        email: "admin@edudash.com",
        password: "amroamro",
        icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
        color: "border-green-100 dark:border-green-900/50 bg-green-50/10 dark:bg-green-900/10"
    },
    {
        role: "Teacher",
        email: "teacher1@edudash.com",
        password: "amroamro",
        icon: <Users className="w-6 h-6 text-purple-500" />,
        color: "border-purple-100 dark:border-purple-900/50 bg-purple-50/10 dark:bg-purple-900/10"
    },
    {
        role: "Student",
        email: "student_1_6@edudash.com",
        password: "amroamro",
        icon: <StudentIcon className="w-6 h-6 text-blue-500" />,
        color: "border-blue-100 dark:border-blue-900/50 bg-blue-50/10 dark:bg-blue-900/10"
    }
];

export default function GuestPage() {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (text: string, fieldId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-100/20 dark:bg-purple-900/10 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-2xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Link
                    href="/login"
                    className="inline-flex items-center text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[40px] border border-white dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 mx-auto mb-6">
                            <GraduationCap className="text-white w-10 h-10" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Demo Access</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                            Explore the EduDash platform with our pre-configured guest accounts specialized for each role.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {GUEST_ACCOUNTS.map((account) => (
                            <div
                                key={account.role}
                                className={`p-6 rounded-3xl border ${account.color} transition-all duration-300 hover:shadow-lg`}
                            >
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                                        {account.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white">{account.role} Portal</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</p>
                                        <div className="relative group">
                                            <div className="w-full pl-5 pr-12 py-4 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 font-bold truncate">
                                                {account.email}
                                            </div>
                                            <button
                                                onClick={() => handleCopy(account.email, `${account.role}-email`)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center min-w-[40px]"
                                                title="Copy Email"
                                            >
                                                {copiedField === `${account.role}-email` ? (
                                                    <span className="flex items-center text-green-600 text-xs font-bold animate-in fade-in zoom-in duration-300">
                                                        <Check className="w-4 h-4 mr-1" /> Copied!
                                                    </span>
                                                ) : (
                                                    <Copy className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secret Key</p>
                                        <div className="relative group">
                                            <div className="w-full pl-5 pr-12 py-4 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 font-bold">
                                                {account.password}
                                            </div>
                                            <button
                                                onClick={() => handleCopy(account.password, `${account.role}-password`)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center min-w-[40px]"
                                                title="Copy Password"
                                            >
                                                {copiedField === `${account.role}-password` ? (
                                                    <span className="flex items-center text-green-600 text-xs font-bold animate-in fade-in zoom-in duration-300">
                                                        <Check className="w-4 h-4 mr-1" /> Copied!
                                                    </span>
                                                ) : (
                                                    <Copy className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center text-slate-400 text-sm font-medium">
                        <p>Ready to try? <Link href="/login" className="text-blue-600 font-black hover:underline underline-offset-4">Log in now</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
