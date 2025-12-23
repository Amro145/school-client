'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchClassRooms, createNewUser } from '@/lib/redux/slices/adminSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    UserPlus,
    Mail,
    Lock,
    Shield,
    Layers,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    User
} from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

export default function CreateUserPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = searchParams.get('role') || 'student';

    const { classRooms, loading, error } = useSelector((state: RootState) => state.admin);

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        role: initialRole,
        classId: ''
    });

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        dispatch(fetchClassRooms());
        // Update role if query param changes
        if (initialRole && initialRole !== formData.role) {
            setFormData(prev => ({ ...prev, role: initialRole }));
        }
    }, [dispatch, initialRole, formData.role]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            classId: formData.classId ? parseInt(formData.classId) : undefined
        };

        const resultAction = await dispatch(createNewUser(payload));
        if (createNewUser.fulfilled.match(resultAction)) {
            setSuccess(true);
            setTimeout(() => {
                router.push(formData.role === 'teacher' ? '/admin/teachers' : '/students');
            }, 2000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link
                href="/admin"
                className="inline-flex items-center space-x-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Intelligence Hub</span>
            </Link>

            <div className="bg-white rounded-[56px] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="relative h-40 bg-slate-900 flex items-center px-12 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -ml-20 -mb-20" />

                    <div className="relative z-10 flex items-center space-x-6">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                            <UserPlus className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">Architect Identity</h1>
                            <p className="text-blue-200 mt-2 font-medium tracking-wide">Registering new institutional nodes into the ecosystem</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-12 space-y-10">
                    {error && (
                        <div className="p-6 bg-rose-50 border border-rose-100 rounded-[32px] flex items-start space-x-4 animate-in shake duration-500">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <AlertCircle className="w-6 h-6 text-rose-500" />
                            </div>
                            <div>
                                <h3 className="text-rose-900 font-black text-sm uppercase tracking-widest leading-none mb-1">Architecture Fault</h3>
                                <p className="text-rose-600 text-sm font-medium italic">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[32px] flex items-start space-x-4 animate-in zoom-in duration-500">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-emerald-900 font-black text-sm uppercase tracking-widest leading-none mb-1">Node Synchronized</h3>
                                <p className="text-emerald-600 text-sm font-medium italic">New identity successfully integrated. Redirecting to operational index...</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Name Field */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Public Identifier (Username)</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder="Enter full legal name..."
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Institutional Email</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="node@institutional-domain.com"
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Access Credentials (Password)</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••••"
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Role Dropdown */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Functional Role</label>
                            <div className="relative group text-blue-500 font-bold uppercase tracking-widest">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="student">STUDENT NODE</option>
                                    <option value="teacher">INSTRUCTOR NODE</option>
                                    <option value="admin">SYSTEM ADMINISTRATOR</option>
                                </select>
                            </div>
                        </div>

                        {/* Class Selection */}
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Curricular Assignment (Classroom)</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <select
                                    name="classId"
                                    value={formData.classId}
                                    onChange={handleChange}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                                    disabled={loading && classRooms.length === 0}
                                >
                                    <option value="">AWAITING Curricular MAPPING (NO CLASS)</option>
                                    {classRooms.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                {loading && classRooms.length === 0 && (
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 flex items-center justify-between border-t border-slate-50">
                        <div className="hidden md:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Architecture Policy</p>
                            <p className="text-slate-400 text-xs italic">Credentials are encrypted at resting state.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`px-16 py-6 bg-slate-900 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center shadow-2xl active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow-blue-500/25'}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Synchronizing...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-3" />
                                    Finalize Identity
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
