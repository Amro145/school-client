'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    GraduationCap,
    BookOpen,
    ArrowUpRight,
    ShieldCheck
} from 'lucide-react';
import { AdminDashboardStats } from '@/types/admin';

interface StatsCardsProps {
    stats: AdminDashboardStats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
    const dashboardStats = [
        {
            name: 'Total Students',
            value: stats?.totalStudents || 0,
            icon: GraduationCap,
            color: 'blue',
            description: 'Active learners enrolled in modules'
        },
        {
            name: 'Total Faculty',
            value: stats?.totalTeachers || 0,
            icon: Users,
            color: 'purple',
            description: 'Verified educational instructors'
        },
        {
            name: 'Classrooms',
            value: stats?.totalClassRooms || 0,
            icon: BookOpen,
            color: 'emerald',
            description: 'Active physical & digital nodes'
        },
        {
            name: 'System Status',
            value: 'Optimal',
            icon: ShieldCheck,
            color: 'blue',
            description: 'Mainframe integrity: 100%'
        },
    ];

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat) => (
                <motion.div
                    key={stat.name}
                    variants={itemVariants}
                    className={`group relative overflow-hidden p-8 rounded-[40px] border border-slate-100 dark:border-slate-800  dark:bg-slate-950 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer`}
                >
                    <div className={`absolute -right-8 -top-8 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`} />
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-8">
                            <div className={`p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.name}</p>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 italic leading-none">{stat.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
