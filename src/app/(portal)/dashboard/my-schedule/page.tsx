'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import {
    Calendar,
    Clock,
    User,
    Home,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
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

export default function MySchedulePage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const getCurrentDay = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[currentTime.getDay()];
    };

    const getCurrentPeriod = () => {
        const hour = currentTime.getHours();
        const hourStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        return hourStr;
    };

    const currentDay = getCurrentDay();
    const currentPeriod = getCurrentPeriod();

    const schedules = user?.schedules || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Calendar className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">My Schedule</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Academic Time-Grid</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4 bg-white dark:bg-slate-900 p-2 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-sm">
                    <div className="px-6 py-3 text-center border-r border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Day</span>
                        <span className="block text-sm font-black text-purple-600 dark:text-purple-400">{currentDay}</span>
                    </div>
                    <div className="px-6 py-3 text-center">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Period</span>
                        <span className="block text-sm font-black text-slate-900 dark:text-white">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white dark:bg-slate-950 rounded-[40px] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <div className="min-w-[1000px] grid grid-cols-[140px_repeat(8,1fr)] bg-slate-200/30 dark:bg-slate-800/50 border-collapse gap-px">
                        {/* Empty Top-Left Corner */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 flex items-center justify-center border-b border-r border-slate-200/60 dark:border-slate-800 sticky left-0 z-30 transition-colors duration-300">
                            <Clock className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                        </div>

                        {/* Period Headers */}
                        {PERIODS.map((period, idx) => {
                            const isCurrent = period.value === currentPeriod;
                            return (
                                <div
                                    key={period.value}
                                    className={`p-6 border-b border-slate-200/60 dark:border-slate-800 flex flex-col items-center justify-center transition-all duration-300
                                        ${isCurrent ? 'bg-purple-600 text-white shadow-[0_0_30px_-5px_rgba(147,51,234,0.3)]' : 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100'}
                                    `}
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 ${isCurrent ? 'text-purple-100' : 'text-slate-400 dark:text-slate-500'}`}>
                                        Slot {idx + 1}
                                    </span>
                                    <span className="text-base font-black tracking-tight">{period.label}</span>
                                </div>
                            );
                        })}

                        {/* Days Rows */}
                        {DAYS.map((day) => (
                            <React.Fragment key={day}>
                                {/* Day Sidebar Header */}
                                <div className={`p-6 border-r border-slate-200/60 dark:border-slate-800 flex items-center justify-center sticky left-0 z-20 transition-all duration-300
                                    ${day === currentDay ? 'bg-purple-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400'}
                                `}>
                                    <span className="text-xs font-black uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180">
                                        {day}
                                    </span>
                                </div>

                                {/* Subject Cells */}
                                {PERIODS.map((period) => {
                                    const schedule = schedules.find(s => s.day === day && s.startTime === period.value);
                                    const isCurrentCell = day === currentDay && period.value === currentPeriod;

                                    return (
                                        <div
                                            key={`${day}-${period.value}`}
                                            className={`relative h-32 p-3 border-b border-r border-slate-200/60 dark:border-slate-800 last:border-r-0 transition-all duration-500 group
                                                ${isCurrentCell ? 'bg-purple-50/50 dark:bg-purple-500/10 ring-2 ring-purple-600 ring-inset z-10' : 'bg-white dark:bg-slate-950'}
                                                ${!schedule && 'hover:bg-slate-50 dark:hover:bg-slate-900/40'}
                                            `}
                                        >
                                            {schedule ? (
                                                <div className="w-full h-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between group-hover:scale-[1.02] group-hover:shadow-lg transition-all duration-300">
                                                    <div>
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                                                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                                                                {schedule.startTime} - {schedule.endTime}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight line-clamp-2 tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                            {schedule.subject?.name}
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                                                        {user?.role === 'student' ? (
                                                            <>
                                                                <User className="w-3 h-3 mr-2 text-slate-400" />
                                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                                                                    {schedule.subject?.teacher?.userName || 'TBA'}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Home className="w-3 h-3 mr-2 text-slate-400" />
                                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                                                                    Room: {schedule.classRoom?.name || 'N/A'}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">Free Slot</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Legend */}
            <div className="flex flex-wrap items-center gap-6 px-4 py-2">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-purple-600 ring-4 ring-purple-100 dark:ring-purple-900/20" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Ongoing Period</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Scheduled Lecture</span>
                </div>
                <div className="ml-auto">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                        Auto-sync enabled • {user?.role === 'student' ? user?.class?.name : 'Faculty View'}
                    </p>
                </div>
            </div>
        </div>
    );
}
