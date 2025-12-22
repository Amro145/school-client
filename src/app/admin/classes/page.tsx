import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Classes Management | EduDash",
    description: "Monitor class performance, students, and subjects.",
};
import { getData, calculateSuccessRate } from '@/lib/data';
import { Plus, ChevronRight, BookOpen, Users } from 'lucide-react';

export default function ClassesListPage() {
    const data = getData();

    const classesWithStats = data.classes.map(cls => {
        const classStudents = data.students.filter(s => s.classId === cls.id);
        const classSubjects = data.subjects.filter(sub => sub.classId === cls.id);

        // Calculate success rate for students in this class
        const allGrades = classStudents.flatMap(s => Object.values(s.grades));
        const successRate = calculateSuccessRate(allGrades);

        return {
            ...cls,
            studentCount: classStudents.length,
            subjectCount: classSubjects.length,
            successRate
        };
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Class Cohorts</h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg italic">Strategic monitoring of classroom performance and student density...</p>
                </div>
                <Link
                    href="/admin/classes/new"
                    className="relative group overflow-hidden"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest leading-none">
                        <Plus className="w-5 h-5 mr-3" /> Construct New Cohort
                    </div>
                </Link>
            </div>

            <div className="bg-white rounded-[48px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-10 py-6">Cohort Identification</th>
                                <th className="px-10 py-6">Student Density</th>
                                <th className="px-10 py-6 text-center">Curriculum Scope</th>
                                <th className="px-10 py-6">Success Trajectory</th>
                                <th className="px-10 py-6 text-right">Operational Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {classesWithStats.map((cls) => (
                                <tr key={cls.id} className="hover:bg-slate-50/30 transition-all duration-300 group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center space-x-5">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                <BookOpen className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 leading-none mb-1.5 group-hover:text-blue-600 transition-colors">{cls.name}</h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black uppercase tracking-widest whitespace-nowrap">ID: {cls.id}</span>
                                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-black uppercase tracking-widest whitespace-nowrap">ACTIVE</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center text-slate-900 font-black">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
                                                <Users className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                            </div>
                                            {cls.studentCount} <span className="text-slate-400 font-bold ml-1.5 uppercase tracking-tighter text-xs">Learners</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <div className="inline-flex items-center px-4 py-2 bg-white border border-slate-100 shadow-sm rounded-2xl font-black text-sm group-hover:border-blue-100 transition-colors">
                                            {cls.subjectCount} <span className="text-slate-400 font-bold ml-2 uppercase tracking-tighter text-xs">Subjects</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col">
                                            <div className="flex items-center space-x-4 w-full max-w-[160px]">
                                                <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${cls.successRate >= 85 ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : cls.successRate >= 70 ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]' : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]'}`}
                                                        style={{ width: `${cls.successRate}%` }}
                                                    />
                                                </div>
                                                <span className={`font-black text-sm tabular-nums ${cls.successRate >= 85 ? 'text-emerald-600' : cls.successRate >= 70 ? 'text-blue-600' : 'text-rose-600'}`}>
                                                    {cls.successRate}%
                                                </span>
                                            </div>
                                            <div className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Score Metric</div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <Link
                                            href={`/admin/classes/${cls.id}`}
                                            className="inline-flex items-center justify-center p-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm border border-slate-200/50 hover:border-blue-100 active:scale-95 group/btn"
                                        >
                                            <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 bg-slate-50/30 border-t border-slate-100 text-center glass">
                    <button className="bg-white text-slate-800 border border-slate-200 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-xl shadow-slate-200/50 active:scale-95">
                        Initialize Advanced Analytics Node
                    </button>
                </div>
            </div>
        </div>
    );
}
