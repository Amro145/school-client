import Link from 'next/link';
import { GraduationCap, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Welcome | EduDash School Management",
  description: "Join our modern educational platform. Access student, teacher, or admin portals.",
};

export default function LandingPage() {
  const roles = [
    {
      title: "Login as Student",
      description: "View your grades, classes, and subjects. Track your academic progress effortlessly.",
      icon: <GraduationCap className="w-12 h-12 text-blue-500" />,
      href: "/login?role=student",
      color: "bg-blue-50 border-blue-100 hover:border-blue-300",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Login as Teacher",
      description: "Manage your subjects, update student grades, and track class success rates.",
      icon: <Users className="w-12 h-12 text-purple-500" />,
      href: "/login?role=teacher",
      color: "bg-purple-50 border-purple-100 hover:border-purple-300",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Login as Admin",
      description: "Full control over the system. Manage teachers, students, classes, and subjects.",
      icon: <ShieldCheck className="w-12 h-12 text-green-500" />,
      href: "/login?role=admin",
      color: "bg-green-50 border-green-100 hover:border-green-300",
      buttonColor: "bg-green-600 hover:bg-green-700"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 to-white -z-10" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Smart <span className="text-blue-600">School</span> Management
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            A comprehensive, modern solution for educational institutions.
            Streamlining communication, data management, and academic tracking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {roles.map((role) => (
              <div
                key={role.title}
                className={`flex flex-col p-8 rounded-3xl border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${role.color}`}
              >
                <div className="mb-6 flex justify-center">{role.icon}</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{role.title}</h2>
                <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
                  {role.description}
                </p>
                <Link
                  href={role.href}
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold transition-colors duration-200 ${role.buttonColor}`}
                >
                  Enter Portal <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Social Proof/Stats Section (Optional) */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-slate-400 font-medium">
            <p>1000+ Students</p>
            <p>50+ Classes</p>
            <p>200+ Subjects</p>
            <p>50+ Teachers</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-500 border-t border-slate-100">
        <p>&copy; 2024 School Management System. Built for Modern Education.</p>
      </footer>
    </div>
  );
}
