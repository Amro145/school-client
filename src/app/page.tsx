'use client';

import Link from 'next/link';
import { GraduationCap, Users, ShieldCheck, ArrowRight, PlayCircle, Loader2 } from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { loginUser, logout } from '@/lib/redux/slices/authSlice';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function LandingPage() {
  const roles = [
    {
      title: "Login as Student",
      description: "View your grades, classes, and subjects. Track your academic progress effortlessly.",
      icon: <GraduationCap className="w-12 h-12 text-blue-500" />,
      href: "/login",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      guest: {
        email: "student_1_6@edudash.com",
        password: "EduDash@2024",
      }
    },
    {
      title: "Login as Teacher",
      description: "Manage your subjects, update student grades, and track class success rates.",
      icon: <Users className="w-12 h-12 text-purple-500" />,
      href: "/login",
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      guest: {
        email: "teacher1@edudash.com",
        password: "EduDash@2024"
      }
    },
    {
      title: "Login as Admin",
      description: "Full control over the system. Manage teachers, students, classes, and subjects.",
      icon: <ShieldCheck className="w-12 h-12 text-green-500" />,
      href: "/login",
      color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/50 hover:border-green-300 dark:hover:border-green-700",
      buttonColor: "bg-green-600 hover:bg-green-700",
      guest: {
        email: "admin@edudash.com",
        password: "EduDash@2024",
      }
    }
  ];

  const dispatch = useDispatch<AppDispatch>();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  // Automatically logout user when they land on the home page
  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleGuestLogin = async (role: any) => {
    setLoadingRole(role.title);
    try {
      await dispatch(loginUser({ email: role.guest.email, password: role.guest.password })).unwrap();
      window.location.href = '/admin';
    } catch (err: any) {
      toast.error(err.message || 'Guest Login Failed');
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 selection:bg-blue-100 dark:selection:bg-blue-900 relative transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-from),transparent_50%)] from-blue-50/50 dark:from-blue-900/20" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl -z-10" />

        <LandingNavbar />

        <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-bold animate-bounce-slow">
            ✨ Empowering the next generation of learners
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-8">
            Modernize Your <br />
            <span className="gradient-text">Institution.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
            The all-in-one platform for schools to manage students,
            track performance, and streamline communication.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-2">
            {/* todo add Guest button */}
            {roles.map((role) => (
              <div
                key={role.title}
                className={`group flex flex-col p-8 rounded-[40px] border dark:bg-slate-900/50 /50 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-2 ${role.color.replace('bg-', 'border-').split(' ')[0] ? '' : 'border-slate-100 dark:border-slate-800'}`}
                style={{ borderColor: '' /* dynamic border handled via role.color */ }}
              >
                {/* Note: The role.color logic in original was mixing bg/border. I updated role object above. */}
                {/* Implementing simplified class logic based on the updated role object */}
                <div className={`absolute inset-0 rounded-[40px] border-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${role.color.split(' ').find(c => c.startsWith('hover:border')) || ''}`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                    <div className={`p-5 rounded-3xl ${role.color.split(' ')[0]} shadow-inner`}>
                      {role.icon}
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{role.title}</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-10 grow font-medium leading-relaxed">
                    {role.description}
                  </p>
                  <div className="flex flex-col space-y-3">
                    <Link
                      href={role.href}
                      className={`inline-flex items-center justify-center px-8 py-4 rounded-2xl text-white font-bold transition-all duration-300 shadow-xl ${role.buttonColor} hover:scale-[1.02] active:scale-95`}
                    >
                      Enter Portal <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button
                      onClick={() => handleGuestLogin(role)}
                      disabled={!!loadingRole}
                      className="flex items-center justify-center space-x-2 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                    >
                      {loadingRole === role.title ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          <span>Quick Guest Access</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass dark:bg-slate-900/50 rounded-[48px] p-12 md:p-20 border-slate-200/50 dark:border-slate-800 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-blue-600/5 to-purple-600/5 dark:from-blue-600/10 dark:to-purple-600/10" />
            <div className="relative z-10">
              <h2 className="text-center text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-12">Platform Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { label: 'Students', value: '1,200+' },
                  { label: 'Active Classes', value: '45' },
                  { label: 'Subject Tracks', value: '180+' },
                  { label: 'Certified Teachers', value: '85' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">{stat.value}</p>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white dark:text-slate-900 w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">EDUDASH</span>
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-medium">&copy; 2024 EduDash. Elevating educational standards world-wide.</p>
        </div>
      </footer>
    </div>
  );
}
