import React from 'react';
import Link from 'next/link';
import { GraduationCap, Target, Heart, Shield, ArrowRight, Zap, Globe, Sparkles } from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';

export default function AboutPage() {
    const values = [
        {
            title: "Educational Excellence",
            description: "We believe that through modern technology, we can elevate the learning experience for every student.",
            icon: <Target className="w-8 h-8 text-blue-500" />
        },
        {
            title: "Passionate Innovation",
            description: "Our team is dedicated to building tools that solve real-world problems for educators and administrators.",
            icon: <Heart className="w-8 h-8 text-purple-500" />
        },
        {
            title: "Unmatched Security",
            description: "Data privacy and security are the foundation of everything we build. Your institution's data is safe with us.",
            icon: <Shield className="w-8 h-8 text-green-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-purple-100/20 dark:bg-purple-900/10 rounded-full blur-[140px] -z-10" />

            <LandingNavbar />

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-wider">
                        Our Mission & Vision
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-8">
                        Elevating Educational <br />
                        <span className="gradient-text">Standards.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                        EduDash was founded with a single goal: to bridge the gap between traditional education and modern digital capabilities. We empower institutions to focus on what matters most—learning.
                    </p>
                </div>

                {/* Core Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {values.map((value, idx) => (
                        <div
                            key={value.title}
                            className="p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all group animate-in fade-in slide-in-from-bottom-8 duration-700"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl w-fit group-hover:scale-110 transition-transform duration-500">
                                {value.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{value.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Stats / Impact Section */}
                <div className="relative mb-32">
                    <div className="absolute inset-0 bg-blue-600 rounded-[60px] transform -rotate-1 opacity-10 dark:opacity-20 translate-y-4" />
                    <div className="bg-slate-900 dark:bg-slate-900/80 rounded-[60px] p-12 md:p-24 text-center relative z-10 overflow-hidden border border-slate-800 shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />

                        <div className="relative z-20">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-16 tracking-tight">Our global reach and impact</h2>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                                {[
                                    { label: "Countries Served", val: "12+", icon: <Globe className="w-5 h-5" /> },
                                    { label: "Active Institutions", val: "250+", icon: <Shield className="w-5 h-5" /> },
                                    { label: "Queries/Day", val: "5M+", icon: <Zap className="w-5 h-5" /> },
                                    { label: "User Satisfaction", val: "99%", icon: <Sparkles className="w-5 h-5" /> }
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className="flex justify-center mb-4 text-blue-400">
                                            {stat.icon}
                                        </div>
                                        <div className="text-5xl font-black text-white mb-2">{stat.val}</div>
                                        <div className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center p-12 md:p-20 bg-linear-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-[48px] border border-blue-100 dark:border-blue-900/30 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Ready to join the revolution?</h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
                            Start your free trial today and see how EduDash can transform your school's administrative and educational workflows.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/login"
                                className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black text-lg transition-all shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 flex items-center"
                            >
                                Get Started Now <ArrowRight className="ml-2 w-6 h-6" />
                            </Link>
                            <Link
                                href="/guest"
                                className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-[24px] font-black text-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-700 shadow-lg hover:scale-105 active:scale-95"
                            >
                                Try Demo Access
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

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
