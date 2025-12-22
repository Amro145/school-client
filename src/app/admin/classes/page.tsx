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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Classes Management</h1>
                    <p className="text-slate-500 mt-2">View and manage all classroom groups.</p>
                </div>
                <Link
                    href="/admin/classes/new"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Class
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                            <th className="px-8 py-4">Class Name</th>
                            <th className="px-8 py-4">Students</th>
                            <th className="px-8 py-4">Subjects</th>
                            <th className="px-8 py-4">Success Rate</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {classesWithStats.map((cls) => (
                            <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <BookOpen className="text-blue-600 w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-slate-900">{cls.name}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center text-slate-600">
                                        <Users className="w-4 h-4 mr-2 text-slate-400" />
                                        {cls.studentCount} Students
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-slate-600">
                                    {cls.subjectCount} Subjects
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-grow w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${cls.successRate >= 85 ? 'bg-green-500' : cls.successRate >= 70 ? 'bg-blue-500' : 'bg-orange-500'}`}
                                                style={{ width: `${cls.successRate}%` }}
                                            />
                                        </div>
                                        <span className="font-bold text-slate-700">{cls.successRate}%</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <Link
                                        href={`/admin/classes/${cls.id}`}
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
