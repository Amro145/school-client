import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Subjects Management | EduDash",
    description: "Track curriculum progress and subject-specific success rates.",
};
import { getData, calculateSuccessRate } from '@/lib/data';
import { Plus, ChevronRight, BarChart3, Users, BookOpen } from 'lucide-react';

export default function SubjectsListPage() {
    const data = getData();

    const subjectsWithStats = data.subjects.map(subject => {
        const teacher = data.teachers.find(t => t.id === subject.teacherId);
        const cls = data.classes.find(c => c.id === subject.classId);
        const subjectGrades = data.students
            .filter(s => s.classId === subject.classId)
            .map(s => s.grades[subject.id])
            .filter(g => g !== undefined);

        const successRate = calculateSuccessRate(subjectGrades);

        return {
            ...subject,
            teacherName: teacher?.name || 'Unassigned',
            className: cls?.name || 'Unknown',
            successRate
        };
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Subjects Management</h1>
                    <p className="text-slate-500 mt-2">Manage curriculum subjects and monitor teacher/class performance.</p>
                </div>
                <Link
                    href="/admin/subjects/new"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Subject
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                            <th className="px-8 py-4">Subject Name</th>
                            <th className="px-8 py-4">Teacher</th>
                            <th className="px-8 py-4">Associated Class</th>
                            <th className="px-8 py-4">Success Rate</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {subjectsWithStats.map((subject) => (
                            <tr key={subject.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <BarChart3 className="text-purple-600 w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-slate-900">{subject.name}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center text-slate-600">
                                        <Users className="w-4 h-4 mr-2 text-slate-400" />
                                        {subject.teacherName}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center text-slate-600">
                                        <BookOpen className="w-4 h-4 mr-2 text-slate-400" />
                                        {subject.className}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-grow w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${subject.successRate >= 85 ? 'bg-green-500' : subject.successRate >= 70 ? 'bg-blue-500' : 'bg-orange-500'}`}
                                                style={{ width: `${subject.successRate}%` }}
                                            />
                                        </div>
                                        <span className="font-bold text-slate-700">{subject.successRate}%</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <Link
                                        href={`/admin/subjects/${subject.id}`}
                                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                                    >
                                        View Details <ChevronRight className="ml-1 w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
