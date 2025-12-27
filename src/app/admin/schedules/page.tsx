'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchSchedules, deleteSchedule, fetchClassRooms } from '@/lib/redux/slices/adminSlice';
import {
    Calendar,
    Search,
    Filter,
    Plus,
    Clock,
    User,
    Trash2,
    Edit,
    Loader2,
    Users,
    CheckCircle2,
    BookOpen
} from 'lucide-react';
import { Schedule } from '@/types/admin';
import ScheduleForm from '@/components/ScheduleForm';
import { useSearchParams } from 'next/navigation';

export const runtime = 'edge';

// Configuration for the 8-period grid
const PERIODS = [
    { label: '08:00', value: '08:00' },
    { label: '09:00', value: '09:00' },
    { label: '10:00', value: '10:00' },
    { label: '11:00', value: '11:00' },
    { label: '12:00', value: '12:00' },
    { label: '13:00', value: '13:00' },
    { label: '14:00', value: '14:00' },
    { label: '15:00', value: '15:00' },
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

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
    const { schedules, classRooms, loading, error } = useSelector((state: RootState) => state.admin);

    // State
    const [selectedClassId, setSelectedClassId] = useState<number | string>('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [prefilledSlot, setPrefilledSlot] = useState<{ day: string, startTime: string } | null>(null);

    // Initial load from URL
    useEffect(() => {
        const paramClassId = searchParams.get('classId');
        if (paramClassId) setSelectedClassId(Number(paramClassId));

        if (searchParams.get('action') === 'new') {
            // We keep the generic add modal open if action=new is present, 
            // though the grid interactions are preferred.
            setIsFormOpen(true);
        }
    }, [searchParams]);

    useEffect(() => {
        dispatch(fetchSchedules());
        if (classRooms.length === 0) dispatch(fetchClassRooms());
    }, [dispatch, classRooms.length]);

    const handleCellClick = (day: string, startTime: string, existingSchedule?: Schedule) => {
        if (existingSchedule) {
            // Edit Not directly implemented on click, usually edit icon. 
            // But we can nothing here or show details?
            // Let's stick to the icons for actions to keep it clean.
        } else {
            // Open Add Modal prefilled
            setEditingSchedule(null);
            setPrefilledSlot({ day, startTime });
            setIsFormOpen(true);
        }
    };

    const handleEdit = (schedule: Schedule) => {
        setEditingSchedule(schedule);
        setPrefilledSlot(null);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this schedule slot?')) {
            await dispatch(deleteSchedule(id));
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingSchedule(null);
        setPrefilledSlot(null);
    };

    // Filter schedules for the selected class
    const classSchedules = selectedClassId
        ? schedules.filter(s => s.classRoom?.id.toString() === selectedClassId.toString())
        : [];

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
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Class Timetable Management</p>
                    </div>
                </div>

                {/* Class Selector - Central to the Grid View */}
                <div className="relative min-w-[300px]">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold shadow-sm focus:ring-2 focus:ring-blue-500 appearance-none transition-all"
                    >
                        <option value="">Select a Class to View Schedule</option>
                        {classRooms.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid Area */}
            <div className="bg-white dark:bg-slate-950 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
                {!selectedClassId ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-slate-300" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">No Class Selected</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2">Please select a class from the dropdown above to manage its weekly schedule.</p>
                        </div>
                    </div>
                ) : (
                    <div className="min-w-[1000px] p-6">
                        {/* Grid Header (Periods) */}
                        <div className="grid grid-cols-[150px_repeat(8,1fr)] gap-2 mb-4">
                            <div className="flex items-center justify-center font-black text-slate-400 uppercase tracking-widest text-xs">Day / Period</div>
                            {PERIODS.map((period, index) => (
                                <div key={period.value} className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Period {index + 1}</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{period.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Grid Rows (Days) */}
                        <div className="space-y-2">
                            {DAYS.map(day => (
                                <div key={day} className="grid grid-cols-[150px_repeat(8,1fr)] gap-2 h-32">
                                    {/* Day Label */}
                                    <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-white font-black uppercase tracking-widest text-sm shadow-lg shadow-slate-200 dark:shadow-none">
                                        {day}
                                    </div>

                                    {/* Slots */}
                                    {PERIODS.map(period => {
                                        // Find schedule
                                        const schedule = classSchedules.find(s => s.day === day && s.startTime === period.value);

                                        return (
                                            <div
                                                key={`${day}-${period.value}`}
                                                className={`relative rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center p-2 group
                                                    ${schedule
                                                        ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700'
                                                        : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 border-dashed'
                                                    }
                                                `}
                                            >
                                                {schedule ? (
                                                    <>
                                                        <div className="text-center w-full">
                                                            <div className="font-black text-slate-900 dark:text-white text-xs mb-1 line-clamp-2 leading-tight">
                                                                {schedule.subject?.name}
                                                            </div>
                                                            <div className="flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950 px-2 py-1 rounded-full shadow-sm max-w-full truncate">
                                                                <User className="w-3 h-3 mr-1 flex-shrink-0" />
                                                                {schedule.subject?.teacher?.userName || 'N/A'}
                                                            </div>
                                                        </div>

                                                        {/* Hover Actions */}
                                                        <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 items-center justify-center gap-2 opacity-0 group-hover:opacity-100 flex transition-opacity backdrop-blur-sm rounded-2xl">
                                                            <button
                                                                onClick={() => handleEdit(schedule)}
                                                                className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:scale-110 transition-transform"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(Number(schedule.id))}
                                                                className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:scale-110 transition-transform"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleCellClick(day, period.value)}
                                                        className="w-8 h-8 rounded-full bg-white dark:bg-slate-950 flex items-center justify-center text-slate-300 group-hover:text-blue-500 group-hover:scale-110 transition-all shadow-sm"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isFormOpen && (
                <ScheduleForm
                    onClose={handleCloseForm}
                    initialData={editingSchedule}
                    preselectedClassId={Number(selectedClassId)}
                // Pass prefilled data (for adding new slot)
                // Note: ScheduleForm needs to accept these or handle initialData being Partial
                />
            )}
        </div>
    );
}
