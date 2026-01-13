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
    User
} from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';


export default function CreateUserPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = searchParams.get('role') || 'student';

    const { classRooms, loading } = useSelector((state: RootState) => state.admin);

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        role: initialRole,
        classId: ''
    });

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

        // Dynamic import
        const Swal = (await import('sweetalert2')).default;
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });

        const resultAction = await dispatch(createNewUser(payload));
        if (createNewUser.fulfilled.match(resultAction)) {
            Toast.fire({
                icon: "success",
                title: "User created successfully"
            });
            setTimeout(() => {
                router.push(formData.role === 'teacher' ? '/admin/teachers' : '/students');
            }, 1000);
        } else {
            Toast.fire({
                icon: "error",
                title: resultAction.payload as string || "Failed to create user"
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link
                href="/admin"
                className="inline-flex items-center space-x-3 px-6 py-3  dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Intelligence Hub</span>
            </Link>

            <div className=" dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="relative h-40 bg-slate-900 flex items-center px-12 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -ml-20 -mb-20" />

                    <div className="relative z-10 flex items-center space-x-6">
                        <div className="w-20 h-20 /10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                            <UserPlus className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">Architect Identity</h1>
                            <p className="text-blue-200 mt-2 font-medium tracking-wide">Registering new institutional nodes into the ecosystem</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-12 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Name Field */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Public Identifier (Username)</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder="Enter full legal name..."
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] focus: dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 outline-none font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Institutional Email</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="node@institutional-domain.com"
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] focus: dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 outline-none font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Access Credentials (Password)</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••••"
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] focus: dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 outline-none font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Role Dropdown */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Functional Role</label>
                            <div className="relative group text-blue-500 font-bold uppercase tracking-widest">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={(e) => {
                                        const newRole = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            role: newRole,
                                            classId: newRole === 'student' ? prev.classId : '' // Clear class if not student, optionally
                                        }));
                                    }}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] focus: dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 outline-none font-bold text-slate-900 dark:text-white transition-all appearance-none cursor-pointer"
                                >
                                    <option value="student">STUDENT NODE</option>
                                    <option value="teacher">INSTRUCTOR NODE</option>
                                    <option value="admin">SYSTEM ADMINISTRATOR</option>
                                </select>
                            </div>
                        </div>

                        {/* Class Selection */}
                        {formData.role === 'student' && (
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
                                    Curricular Assignment (Classroom) {formData.role === 'student' && <span className="text-red-500">*</span>}
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <select
                                        name="classId"
                                        value={formData.classId}
                                        onChange={handleChange}
                                        required={formData.role === 'student'}
                                        className={`w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border rounded-[28px] outline-none font-bold text-slate-900 dark:text-white transition-all appearance-none cursor-pointer ${formData.role === 'student' && !formData.classId
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-50'
                                            : 'border-slate-100 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-50'
                                            } focus:ring-4 dark:focus:bg-slate-800 dark:focus:ring-blue-900/20`}
                                        disabled={loading && classRooms.length === 0}
                                    >
                                        <option value="">{formData.role === 'student' ? 'SELECT A CLASS (REQUIRED)' : 'AWAITING Curricular MAPPING (NO CLASS)'}</option>
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
                        )}
                    </div>

                    <div className="pt-10 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50">
                        <div className="hidden md:block">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">Architecture Policy</p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs italic">Credentials are encrypted at resting state.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-16 py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center shadow-2xl active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow-blue-500/25'}`}
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
