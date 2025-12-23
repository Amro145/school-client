'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchTeacher } from '@/lib/redux/slices/teacherSlice';
import {
    Search,
    BookOpen,
    Filter,
    ArrowRight,
    Loader2,
    GraduationCap,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherSubjectsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { currentTeacher, loading } = useSelector((state: RootState) => state.teacher);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Ensure data is fresh
        dispatch(fetchTeacher());
    }, [dispatch]);

    if (loading && !currentTeacher) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Fetching curriculum data...</p>
            </div>
        );
    }

    if (!currentTeacher) return null;

    const subjects = currentTeacher.subjectsTaught || [];
    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subject.class?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">My Subjects</h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg italic tracking-tight">Manage your assigned academic modules.</p>
                </div>

                {/* Search Bar */}
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search modules or cohorts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all outline-none shadow-sm"
                        />
                    </div>
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm active:scale-95">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.map(subject => {
                    const enrollment = subject.grades.length;

                    return (
                        <Link key={subject.id} href={`/subjects/${subject.id}`} className="group relative bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <BookOpen className="w-32 h-32" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-2xl text-purple-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        {subject.name.charAt(0)}
                                    </div>
                                    <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                        <GraduationCap className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{subject.class?.name || 'N/A'}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-purple-600 transition-colors tracking-tight uppercase leading-none">{subject.name}</h3>
                                <p className="text-slate-400 font-bold text-sm italic mb-8">Module ID: {subject.id}</p>

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between group-hover:border-slate-100 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enrolled</span>
                                        <span className="text-xl font-black text-slate-900 tabular-nums">{enrollment}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all transform group-hover:-rotate-45">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {filteredSubjects.length === 0 && (
                <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                        <AlertCircle className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Modules Found</h3>
                    <p className="text-slate-500 font-medium italic">Adjust your search parameters or contact administration.</p>
                </div>
            )}
        </div>
    );
}
