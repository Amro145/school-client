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
      href: "/login",
      color: "bg-blue-50 border-blue-100 hover:border-blue-300",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Login as Teacher",
      description: "Manage your subjects, update student grades, and track class success rates.",
      icon: <Users className="w-12 h-12 text-purple-500" />,
      href: "/login",
      color: "bg-purple-50 border-purple-100 hover:border-purple-300",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Login as Admin",
      description: "Full control over the system. Manage teachers, students, classes, and subjects.",
      icon: <ShieldCheck className="w-12 h-12 text-green-500" />,
      href: "/login",
      color: "bg-green-50 border-green-100 hover:border-green-300",
      buttonColor: "bg-green-600 hover:bg-green-700"
    }
  ];

  return (
    <div className="min-h-screen  selection:bg-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-from),transparent_50%)] from-blue-50/50" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />

        <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">EDUDASH</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#about" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">About</Link>
            <Link href="/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-200">Get Started</Link>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold animate-bounce-slow">
            ✨ Empowering the next generation of learners
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
            Modernize Your <br />
            <span className="gradient-text">Institution.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
            The all-in-one platform for schools to manage students,
            track performance, and streamline communication.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-2">
            {roles.map((role) => (
              <div
                key={role.title}
                className={`group flex flex-col p-8 rounded-[40px] border border-slate-100 /50 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-2`}
              >
                <div className="mb-8 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                  <div className={`p-5 rounded-3xl ${role.color.split(' ')[0]} shadow-inner`}>
                    {role.icon}
                  </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">{role.title}</h2>
                <p className="text-slate-500 mb-10 grow font-medium leading-relaxed">
                  {role.description}
                </p>
                <Link
                  href={role.href}
                  className={`inline-flex items-center justify-center px-8 py-4 rounded-2xl text-white font-bold transition-all duration-300 shadow-xl ${role.buttonColor} hover:scale-[1.02] active:scale-95`}
                >
                  Enter Portal <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass rounded-[48px] p-12 md:p-20 border-slate-200/50 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-blue-600/5 to-purple-600/5" />
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { label: 'Students', value: '1,200+' },
                { label: 'Active Classes', value: '45' },
                { label: 'Subject Tracks', value: '180+' },
                { label: 'Certified Teachers', value: '85' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-6 grayscale opacity-50">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">EDUDASH</span>
          </div>
          <p className="text-slate-400 font-medium">&copy; 2024 EduDash. Elevating educational standards world-wide.</p>
        </div>
      </footer>
    </div>
  );
}
