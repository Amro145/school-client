import React from 'react';
import {
    GraduationCap,
    ShieldCheck,
    Users,
    BookOpen,
    ClipboardCheck,
    Calendar,
    BarChart3,
    LayoutDashboard,
    Database,
    Globe2,
    Lock,
    Zap,
    ArrowRight
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import Link from 'next/link';

export default function FeaturesPage() {
    const featureSections = [
        {
            role: "Administrative Operations",
            icon: <ShieldCheck className="w-12 h-12 text-green-500" />,
            color: "green",
            features: [
                { title: "Multi-Tenant Control", desc: "Isolate institution data with secure multi-tenant architecture.", icon: <Database /> },
                { title: "Role Management", desc: "Fine-grained access control for admins, teachers, and students.", icon: <Lock /> },
                { title: "School Hierarchy", desc: "Manage classes, subjects, and departmental structures easily.", icon: <LayoutDashboard /> },
                { title: "Global Settings", desc: "Configure institution-wide terms, grading systems, and schedules.", icon: <Globe2 /> }
            ]
        },
        {
            role: "Educator Tools",
            icon: <Users className="w-12 h-12 text-purple-500" />,
            color: "purple",
            features: [
                { title: "Gradebook Mastery", desc: "Effortlessly log and manage student performance across subjects.", icon: <ClipboardCheck /> },
                { title: "Dynamic Scheduling", desc: "Manage your teaching timetable with real-time conflict detection.", icon: <Calendar /> },
                { title: "Student Insights", desc: "Track individual student progress and identifying areas of support.", icon: <BarChart3 /> },
                { title: "Subject Resources", desc: "Organize lesson plans and materials for your academic modules.", icon: <BookOpen /> }
            ]
        },
        {
            role: "Student Experience",
            icon: <GraduationCap className="w-12 h-12 text-blue-500" />,
            color: "blue",
            features: [
                { title: "Personal Dashboard", desc: "Real-time view of upcoming classes, grades, and assignments.", icon: <LayoutDashboard /> },
                { title: "Performance Tracking", desc: "Visualize academic journey with automated score averaging.", icon: <BarChart3 /> },
                { title: "Mobile Ready", desc: "Access your portal from any device with optimized responsive design.", icon: <Zap /> },
                { title: "Direct Enrollment", desc: "View subjects and class schedules customized for your track.", icon: <BookOpen /> }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/20 dark:bg-purple-900/10 rounded-full blur-[140px] -z-10" />

            <LandingNavbar />

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                {/* Header */}
                <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-wider">
                        Powerful & Flexible
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-8">
                        Features Built for <br />
                        <span className="gradient-text">Excellence.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                        EduDash provides a comprehensive suite of tools designed to handle every aspect of modern school management.
                    </p>
                </div>

                {/* Feature Sections */}
                <div className="space-y-40">
                    {featureSections.map((section, sectionIdx) => (
                        <div key={section.role} className="relative">
                            <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                                <div className={`p-6 rounded-[32px] bg-${section.color}-50 dark:bg-${section.color}-900/20 shadow-inner`}>
                                    {section.icon}
                                </div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{section.role}</h2>
                                    <div className={`h-1.5 w-24 bg-${section.color}-500 rounded-full mt-4`} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {section.features.map((feature, idx) => (
                                    <div
                                        key={feature.title}
                                        className="group p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all animate-in fade-in slide-in-from-bottom-8 duration-700"
                                        style={{ animationDelay: `${(sectionIdx * 4 + idx) * 100}ms` }}
                                    >
                                        <div className={`mb-6 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 text-${section.color}-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 w-fit`}>
                                            {React.cloneElement(feature.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{feature.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tech Stack Highlights */}
                <div className="mt-40 pt-40 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Powered by Infrastructure.</h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Built on the Edge for maximum performance and security.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Serverless Speed", val: "Global delivery via Cloudflare Workers for near-zero latency.", icon: <Zap /> },
                            { title: "Secure Data", val: "Enterprise-grade encryption and isolation for all tenant data.", icon: <Lock /> },
                            { title: "Real-time", val: "GraphQL Yoga powered API for efficient, live data communication.", icon: <BarChart3 /> }
                        ].map((item) => (
                            <div key={item.title} className="flex flex-col items-center text-center px-6">
                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mb-6 font-black">
                                    {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-8 h-8" })}
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{item.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-40 text-center animate-in fade-in zoom-in duration-1000">
                    <Link
                        href="/guest"
                        className="inline-flex items-center px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[32px] text-xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/20 dark:shadow-white/10"
                    >
                        Explore the Demo Portal <ArrowRight className="ml-3 w-7 h-7" />
                    </Link>
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
