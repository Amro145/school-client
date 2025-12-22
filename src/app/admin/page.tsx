import { getData } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Admin Dashboard | EduDash",
    description: "Advanced school management overview and quick actions.",
};
import {
    Users,
    GraduationCap,
    BookOpen,
    BarChart3,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
    const data = getData();

    const stats = [
        {
            name: 'Total Students',
            value: data.students.length,
            icon: GraduationCap,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            name: 'Total Teachers',
            value: data.teachers.length,
            icon: Users,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            name: 'Total Classes',
            value: data.classes.length,
            icon: BookOpen,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            name: 'Total Subjects',
            value: data.subjects.length,
            icon: BarChart3,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2">Welcome back, Administrator. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                            <div className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                +12%
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all font-medium text-slate-700">
                            Add Student <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-purple-50 hover:text-purple-600 transition-all font-medium text-slate-700">
                            Add Teacher <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-green-50 hover:text-green-600 transition-all font-medium text-slate-700">
                            Create Class <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-all font-medium text-slate-700">
                            New Subject <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">System Status</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl">
                            <span className="text-slate-600">Database Sync</span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ACTIVE</span>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl">
                            <span className="text-slate-600">Backup Status</span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">SECURE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
