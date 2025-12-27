'use client';

import React from 'react';
import { Clock, BookOpen, MapPin, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ScheduleEntry {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    subject: {
        id: string;
        name: string;
        teacher?: {
            id: string;
            userName: string;
        };
    };
    classRoom: {
        id: string;
        name: string;
    };
}

interface TodaysScheduleWidgetProps {
    schedules: ScheduleEntry[];
    role: 'student' | 'teacher';
}

export default function TodaysScheduleWidget({ schedules, role }: TodaysScheduleWidgetProps) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    // Filter for today's schedules and sort by time
    const todaysSchedules = (schedules || [])
        .filter(s => s.day === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="glass p-8 rounded-[48px] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center">
                        <Clock className="w-6 h-6 mr-3 text-purple-500" />
                        Today's Timeline
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 ml-9">
                        {today}, {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                </div>
                <Link href="/dashboard/my-schedule" className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest hover:underline flex items-center group">
                    Full Grid <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="flex-1 space-y-6 relative">
                {/* Timeline Line */}
                {todaysSchedules.length > 1 && (
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800/50" />
                )}

                {todaysSchedules.map((item, index) => (
                    <div key={item.id} className="relative flex items-start group">
                        {/* Timeline Dot */}
                        <div className="absolute left-[15px] top-2 w-2.5 h-2.5 rounded-full bg-white dark:bg-slate-950 border-2 border-purple-500 z-10 group-hover:scale-150 transition-transform shadow-sm" />

                        <div className="pl-12 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-[24px] bg-slate-50/50 dark:bg-slate-900/30 border border-transparent hover:border-purple-200 dark:hover:border-purple-900/30 hover:bg-white dark:hover:bg-slate-900/50 transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="text-center min-w-[60px]">
                                        <div className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{item.startTime}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Start</div>
                                    </div>

                                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                                    <div>
                                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm leading-tight flex items-center">
                                            {item.subject.name}
                                        </h4>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                {role === 'student' ? (
                                                    <>
                                                        <User className="w-3 h-3 mr-1 text-purple-400" />
                                                        {item.subject.teacher?.userName || 'TBD'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <MapPin className="w-3 h-3 mr-1 text-blue-400" />
                                                        {item.classRoom.name}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end sm:block">
                                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                                        <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Period {index + 1}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {todaysSchedules.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-[24px] flex items-center justify-center text-slate-300 dark:text-slate-800 mb-4">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <p className="text-slate-400 font-bold italic text-sm">No lectures scheduled for today.</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{today} is clear</p>
                    </div>
                )}
            </div>
        </div>
    );
}
