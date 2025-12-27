'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchSchedules, deleteSchedule } from '@/lib/redux/slices/adminSlice';
import {
    Calendar,
    Search,
    Filter,
    Plus,
    MoreVertical,
    Clock,
    MapPin,
    BookOpen,
    User,
    Trash2,
    Edit,
    Loader2
} from 'lucide-react';
import { Schedule } from '@/types/admin';
import ScheduleForm from '@/components/ScheduleForm'; // Ensure this path is correct based on where we created it
import { notFound, useSearchParams } from 'next/navigation';

export const runtime = 'edge';

import { Suspense } from 'react';

export default function AdminSchedulesPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        }>
            <SchedulesContent />
        </Suspense>
    );
}

function SchedulesContent() {
    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const { schedules, loading, error } = useSelector((state: RootState) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

    const initialClassId = searchParams.get('classId') ? Number(searchParams.get('classId')) : undefined;

    useEffect(() => {
        dispatch(fetchSchedules());
        if (searchParams.get('action') === 'new') {
            setIsFormOpen(true);
        }
    }, [dispatch, searchParams]);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this schedule slot?')) {
            await dispatch(deleteSchedule(id));
        }
    };

    const handleEdit = (schedule: Schedule) => {
        setEditingSchedule(schedule);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingSchedule(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingSchedule(null);
    };

    const filteredSchedules = schedules.filter(schedule =>
        schedule.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.classRoom?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.subject?.teacher?.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-orange-900/20">
                        <Calendar className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Master Schedule</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Global Global Timetable & Conflict Management</p>
                    </div>
                </div>
                <button
                    onClick={handleAddNew}
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Slot
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-950 p-4 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by subject, class, or teacher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <button className="px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            ) : filteredSchedules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchedules.map((schedule) => (
                        <div key={schedule.id} className="group bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={() => handleEdit(schedule)}
                                    className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:scale-110 transition-transform"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(Number(schedule.id))}
                                    className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:scale-110 transition-transform"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="space-y-1">
                                    <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        {schedule.day}
                                    </span>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                                        {schedule.subject?.name}
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-slate-500 font-bold text-sm">
                                    <Clock className="w-4 h-4 mr-3 text-slate-400" />
                                    {schedule.startTime} - {schedule.endTime}
                                </div>
                                <div className="flex items-center text-slate-500 font-bold text-sm">
                                    <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                                    {schedule.classRoom?.name}
                                </div>
                                <div className="flex items-center text-slate-500 font-bold text-sm">
                                    <User className="w-4 h-4 mr-3 text-slate-400" />
                                    {schedule.subject?.teacher?.userName}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-slate-400 font-bold italic">No schedules found matching your search.</p>
                </div>
            )}

            {/* Modal */}
            {isFormOpen && (
                <ScheduleForm
                    onClose={handleCloseForm}
                    initialData={editingSchedule}
                    preselectedClassId={initialClassId}
                />
            )}
        </div>
    );
}
