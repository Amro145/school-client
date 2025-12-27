'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { createNewSchedule, updateScheduleThunk, fetchSubjects, fetchClassRooms } from '@/lib/redux/slices/adminSlice';
import { Loader2, Calendar, Clock, BookOpen, Users, AlertCircle, X } from 'lucide-react';
import { Schedule } from '@/types/admin';

interface ScheduleFormProps {
    initialData?: Schedule | null;
    preselectedClassId?: number;
    prefilledSlot?: { day: string; startTime: string } | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ScheduleForm({ initialData, preselectedClassId, prefilledSlot, onClose, onSuccess }: ScheduleFormProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { subjects, classRooms, loading, error } = useSelector((state: RootState) => state.admin);

    // Form State
    const [classId, setClassId] = useState<number | string>(preselectedClassId || initialData?.classRoom?.id || '');
    const [subjectId, setSubjectId] = useState<number | string>(initialData?.subject?.id || '');
    const [day, setDay] = useState<string>(initialData?.day || prefilledSlot?.day || 'Monday');
    const [startTime, setStartTime] = useState<string>(initialData?.startTime || prefilledSlot?.startTime || '');
    const [endTime, setEndTime] = useState<string>(initialData?.endTime || '');
    const [formError, setFormError] = useState<string | null>(null);

    // Fixed Periods Configuration
    const PERIODS = [
        { label: 'Period 1 (08:00 - 09:00)', value: '08:00' },
        { label: 'Period 2 (09:00 - 10:00)', value: '09:00' },
        { label: 'Period 3 (10:00 - 11:00)', value: '10:00' },
        { label: 'Period 4 (11:00 - 12:00)', value: '11:00' },
        { label: 'Period 5 (12:00 - 13:00)', value: '12:00' },
        { label: 'Period 6 (13:00 - 14:00)', value: '13:00' },
        { label: 'Period 7 (14:00 - 15:00)', value: '14:00' },
        { label: 'Period 8 (15:00 - 16:00)', value: '15:00' },
    ];

    const DAYS_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']; // Match grid requirement

    useEffect(() => {
        if (subjects.length === 0) dispatch(fetchSubjects());
        if (classRooms.length === 0) dispatch(fetchClassRooms());
    }, [dispatch, subjects.length, classRooms.length]);

    // Update state when initialData changes or prefilledSlot changes
    useEffect(() => {
        if (initialData) {
            setClassId(initialData.classRoom?.id || classId);
            setSubjectId(initialData.subject?.id || '');
            setDay(initialData.day);
            setStartTime(initialData.startTime);
            setEndTime(initialData.endTime);
        } else {
            if (preselectedClassId) setClassId(preselectedClassId);
            if (prefilledSlot) {
                setDay(prefilledSlot.day);
                setStartTime(prefilledSlot.startTime);
            }
        }
    }, [initialData, preselectedClassId, prefilledSlot, classId]);

    const calculateEndTime = (start: string) => {
        const [hour, minute] = start.split(':').map(Number);
        const endHour = hour + 1;
        return `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!classId || !subjectId || !day || !startTime) {
            setFormError("All fields are required.");
            return;
        }

        const calculatedEndTime = calculateEndTime(startTime);

        const payload = {
            classId: Number(classId),
            subjectId: Number(subjectId),
            day,
            startTime,
            endTime: calculatedEndTime
        };

        try {
            if (initialData) {
                await dispatch(updateScheduleThunk({ id: initialData.id, data: payload })).unwrap();
            } else {
                await dispatch(createNewSchedule(payload)).unwrap();
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            setFormError(err || "Failed to save schedule.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center">
                        <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                        {initialData ? 'Edit Schedule Slot' : 'Add New Schedule Slot'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Error Display */}
                    {(error || formError) && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-start space-x-3 text-red-600 dark:text-red-400 text-sm font-bold">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{formError || error}</p>
                        </div>
                    )}

                    {/* Class Selection */}
                    {!preselectedClassId && (
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Classroom</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select
                                    value={classId}
                                    onChange={(e) => setClassId(Number(e.target.value))}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="">Select Class</option>
                                    {classRooms.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Subject Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                        <div className="relative">
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                value={subjectId}
                                onChange={(e) => setSubjectId(Number(e.target.value))}
                                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>{subject.name} - {subject.teacher?.userName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Day Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Day of Week</label>
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            disabled={!!prefilledSlot}
                            className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none ${prefilledSlot ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 cursor-not-allowed opacity-80' : ''}`}
                        >
                            {DAYS_ORDER.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    {/* Period/Time Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Period Slot (1 Hour)</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                disabled={!!prefilledSlot}
                                className={`w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none ${prefilledSlot ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 cursor-not-allowed opacity-80' : ''}`}
                            >
                                <option value="">Select Period</option>
                                {PERIODS.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-200 dark:shadow-blue-900/20 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (initialData ? 'Update Schedule' : 'Create Schedule')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
