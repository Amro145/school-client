'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { RootState } from '@/lib/redux/store';
import { useFetchData, useMutateData, fetchData } from '@/hooks/useFetchData';
import { Schedule, ClassRoom } from '@shared/types/models';
import {
    Calendar,
    Plus,
    User,
    Trash2,
    Edit,
    Loader2,
    Users,
    BookOpen
} from 'lucide-react';
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
    const searchParams = useSearchParams();

    const { data: adminData, isLoading: loading, refetch } = useFetchData<{ schedules: Schedule[], classRooms: ClassRoom[] }>(
        ['admin', 'schedules-and-classes'],
        `
        query GetAdminSchedulesAndClasses {
          schedules {
            id
            day
            startTime
            endTime
            subject {
              id
              name
              teacher {
                userName
              }
            }
            classRoom {
              id
              name
            }
          }
          classRooms {
            id
            name
          }
        }
        `
    );

    const schedules = adminData?.schedules || [];
    const classRooms = adminData?.classRooms || [];

    // State
    const [selectedClassId, setSelectedClassId] = useState<number | string>('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [prefilledSlot, setPrefilledSlot] = useState<{ day: string, startTime: string } | null>(null);

    // Initial load from URL
    useEffect(() => {
        const paramClassId = searchParams.get('classId');
        if (paramClassId) setSelectedClassId(paramClassId);

        if (searchParams.get('action') === 'new') {
            setIsFormOpen(true);
        }
    }, [searchParams]);

    const { mutateAsync: performDeleteSchedule } = useMutateData(
        async (id: number | string) => {
            const data = await fetchData<{ deleteSchedule: { id: number } }>(
                `
                    mutation DeleteSchedule($id: Int!) {
                        deleteSchedule(id: $id) { id }
                    }
                `,
                { id: Number(id) }
            );
            return data.deleteSchedule;
        },
        [['admin', 'schedules-and-classes'], ['class']]
    );

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

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this schedule slot?')) {
            await performDeleteSchedule(id);
            refetch();
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

            {/* Grid Area - Table Layout */}
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
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
                    <div className="min-w-[1000px]">
                        {/* CSS Grid Table with border-collapse look */}
                        <div className="grid grid-cols-[120px_repeat(8,1fr)] border-collapse">

                            {/* Header Row */}
                            <div className="bg-slate-800 text-white p-4 text-xs font-black uppercase tracking-widest flex items-center justify-center border-b border-r border-slate-700 sticky left-0 z-20">
                                Day / Time
                            </div>
                            {PERIODS.map((period, index) => (
                                <div key={period.value} className="bg-slate-800 text-white p-3 flex flex-col items-center justify-center border-b border-r border-slate-700 last:border-r-0">
                                    <span className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Period {index + 1}</span>
                                    <span className="text-sm font-bold">{period.label}</span>
                                </div>
                            ))}

                            {/* Data Rows */}
                            {DAYS.map(day => (
                                <React.Fragment key={day}>
                                    {/* Row Header (Day) */}
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-r border-slate-200 dark:border-slate-800 flex items-center justify-center font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs sticky left-0 z-10">
                                        {day}
                                    </div>

                                    {/* Time Slots */}
                                    {PERIODS.map(period => {
                                        const schedule = classSchedules.find(s => s.day === day && s.startTime === period.value);
                                        const isSelected = (prefilledSlot && prefilledSlot.day === day && prefilledSlot.startTime === period.value) ||
                                            (editingSchedule && editingSchedule.id === schedule?.id && schedule !== undefined);

                                        return (
                                            <div
                                                key={`${day}-${period.value}`}
                                                className={`relative h-28 border-b border-r border-slate-200 dark:border-slate-800 last:border-r-0 group transition-all
                                                    ${isSelected ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/50 dark:bg-blue-900/20 z-10' :
                                                        schedule
                                                            ? 'bg-blue-50/30 dark:bg-blue-900/10'
                                                            : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'}
                                                `}
                                            >
                                                {schedule ? (
                                                    <div className="w-full h-full p-2 flex flex-col items-center justify-center text-center">
                                                        <div className="font-black text-slate-900 dark:text-white text-xs mb-2 line-clamp-2 leading-tight">
                                                            {schedule.subject?.name}
                                                        </div>
                                                        <div className="flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-950/50 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-800 max-w-full truncate">
                                                            <User className="w-3 h-3 mr-1 shrink-0" />
                                                            {schedule.subject?.teacher?.userName || 'N/A'}
                                                        </div>

                                                        {/* Hover Actions */}
                                                        <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                                                            <button
                                                                onClick={() => handleEdit(schedule)}
                                                                className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:scale-110 transition-transform"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(String(schedule.id))}
                                                                className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:scale-110 transition-transform"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => handleCellClick(day, period.value)}
                                                        className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                    >
                                                        <Plus className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isFormOpen && (
                <ScheduleForm
                    onClose={handleCloseForm}
                    onSuccess={() => refetch()}
                    initialData={editingSchedule}
                    preselectedClassId={selectedClassId ? String(selectedClassId) : undefined}
                    prefilledSlot={prefilledSlot}
                />
            )}
        </div>
    );
}
