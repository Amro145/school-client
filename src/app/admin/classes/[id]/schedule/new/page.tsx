'use client';

import { RootState } from '@/lib/redux/store';
import { useFetchData, useMutateData } from '@/hooks/useFetchData';
import { ClassRoom } from '@shared/types/models';
import axios from 'axios';
import {
    ArrowLeft,
    Clock,
    Calendar,
    Save,
    AlertCircle,
    Loader2,
    CheckCircle2,
    Layers,
    BookOpen
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleSchema, ScheduleFormValues } from '@/lib/validations/exams';
import FormSelect from '@/components/FormSelect';

export const runtime = 'edge';

const DAYS = [
    { value: 'Sunday', label: 'SUNDAY' },
    { value: 'Monday', label: 'MONDAY' },
    { value: 'Tuesday', label: 'TUESDAY' },
    { value: 'Wednesday', label: 'WEDNESDAY' },
    { value: 'Thursday', label: 'THURSDAY' },
];

const PERIODS = [
    { label: '08:00 - 09:00', value: '08:00' },
    { label: '09:00 - 10:00', value: '09:00' },
    { label: '10:00 - 11:00', value: '10:00' },
    { label: '11:00 - 12:00', value: '11:00' },
    { label: '12:00 - 13:00', value: '12:00' },
    { label: '13:00 - 14:00', value: '13:00' },
    { label: '14:00 - 15:00', value: '14:00' },
    { label: '15:00 - 16:00', value: '15:00' },
];

export default function CreateSchedulePage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const { data: classData, isLoading: adminLoading, error: fetchError } = useFetchData<{ classRoom: ClassRoom }>(
        ['class', id],
        `
        query GetClassDetails($id: String!) {
          classRoom(id: $id) {
            id
            name
            subjects {
              id
              name
              teacher {
                userName
              }
            }
            schedules {
              id
              day
              startTime
              endTime
              subject {
                name
              }
            }
          }
        }
        `,
        { id: String(id) }
    );

    const currentClass = classData?.classRoom;
    const serverError = fetchError ? (fetchError as any).message : null;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid, isSubmitting },
    } = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleSchema),
        mode: 'onChange',
        defaultValues: {
            subjectId: '',
            day: 'Monday',
            startTime: ''
        }
    });

    const watchDay = watch('day');
    const watchStartTime = watch('startTime');

    const { mutateAsync: createSchedule } = useMutateData(
        async (payload: any) => {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://schoolapi.amroaltayeb14.workers.dev/graphql';
            const response = await axios.post(apiBase, {
                query: `
                    mutation CreateSchedule($classId: String!, $subjectId: String!, $day: String!, $startTime: String!, $endTime: String!) {
                        createSchedule(classId: $classId, subjectId: $subjectId, day: $day, startTime: $startTime, endTime: $endTime) {
                            id
                        }
                    }
                `,
                variables: payload
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            return response.data;
        },
        [['class', id]]
    );

    const calculateEndTime = (start: string) => {
        if (!start) return '';
        const [hour, minute] = start.split(':').map(Number);
        const endHour = hour + 1;
        return `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    const onSubmit = async (data: ScheduleFormValues) => {
        // Dynamic import
        const Swal = (await import('sweetalert2')).default;

        if (!currentClass) return;

        // Simple Client-side check for this exact slot
        const existingSchedules = currentClass.schedules?.filter(s => s.day === data.day) || [];
        const conflict = existingSchedules.find(s => s.startTime === data.startTime);

        if (conflict) {
            Swal.fire({
                icon: 'error',
                title: 'Schedule Conflict',
                text: `This time slot is already occupied by ${conflict.subject?.name}.`
            });
            return;
        }

        const endTime = calculateEndTime(data.startTime);

        try {
            await createSchedule({
                classId: String(id),
                subjectId: String(data.subjectId),
                day: data.day,
                startTime: data.startTime,
                endTime: endTime
            });
            Swal.fire({
                icon: 'success',
                title: 'Schedule Registered',
                timer: 1500,
                showConfirmButton: false
            });
            router.push(`/admin/classes/${id}`);
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Sync Error',
                text: err.message || 'Failed to register schedule'
            });
        }
    };

    if (adminLoading && !currentClass) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] animate-pulse">Synchronizing Class Matrix...</p>
            </div>
        );
    }

    if (!currentClass) return null;

    const currentDaySchedules = currentClass.schedules?.filter(s => s.day === watchDay).sort((a, b) => a.startTime.localeCompare(b.startTime)) || [];
    const loading = adminLoading || isSubmitting;

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link
                href={`/admin/classes/${id}`}
                className="inline-flex items-center space-x-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Class Protocol</span>
            </Link>

            <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -mr-48 -mt-48" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center space-x-8">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[32px] flex items-center justify-center border border-white/20 shadow-inner">
                            <Clock className="w-12 h-12 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tight leading-none uppercase">Architect Schedule</h1>
                            <p className="text-indigo-200 mt-3 font-medium tracking-wide text-lg">Temporal mapping for <span className="text-white font-black">{currentClass.name.toUpperCase()}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-950 p-12 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        {serverError && (
                            <div className="p-6 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl flex items-start space-x-4 animate-in slide-in-from-top-2">
                                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-red-700 dark:text-red-400 uppercase tracking-wider">Sync Error</p>
                                    <p className="text-xs font-bold text-red-600/80 dark:text-red-400/80">{serverError}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-8">
                            <FormSelect
                                label="Academic Subject"
                                icon={BookOpen}
                                placeholder="SELECT SUBJECT"
                                register={register('subjectId')}
                                error={errors.subjectId}
                                disabled={loading}
                                options={currentClass.subjects?.map(subject => ({
                                    value: subject.id,
                                    label: `${subject.name.toUpperCase()} (${subject.teacher?.userName.toUpperCase() || 'UNASSIGNED'})`
                                })) || []}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormSelect
                                    label="Temporal Day"
                                    icon={Calendar}
                                    register={register('day')}
                                    error={errors.day}
                                    disabled={loading}
                                    options={DAYS}
                                />

                                <FormSelect
                                    label="Temporal Period"
                                    icon={Clock}
                                    placeholder="SELECT PERIOD"
                                    register={register('startTime')}
                                    error={errors.startTime}
                                    disabled={loading}
                                    options={PERIODS}
                                />
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 border-t border-slate-50 dark:border-slate-800/50">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-8 py-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-[0.98]"
                                disabled={loading}
                            >
                                Abort
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isValid}
                                className={`flex-2 bg-slate-900 dark:bg-blue-600 text-white font-black py-5 rounded-3xl shadow-2xl transition-all flex items-center justify-center text-xs uppercase tracking-[0.2em] active:scale-[0.98] ${!isValid || loading ? 'opacity-70 grayscale-[0.5] cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-blue-500/25 hover:-translate-y-1'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                        Integrating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-3 h-5 w-5" /> Deploy Slot
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview Matrix */}
                <div className="lg:col-span-2 space-y-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center px-4">
                        <Calendar className="w-4 h-4 mr-3 text-indigo-500" /> Matrix Preview: {watchDay?.toUpperCase()}
                    </h3>

                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800/60 min-h-[400px]">
                        {currentDaySchedules.length > 0 ? (
                            <div className="space-y-6">
                                {currentDaySchedules.map((schedule) => (
                                    <div key={schedule.id} className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-xl shadow-slate-200/20 dark:shadow-none animate-in fade-in zoom-in-95">
                                        <div>
                                            <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 mb-2 flex items-center tracking-widest">
                                                <Clock className="w-3 h-3 mr-2" />
                                                {schedule.startTime} - {calculateEndTime(schedule.startTime)}
                                            </div>
                                            <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{schedule.subject?.name}</div>
                                        </div>
                                        <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-500 border border-green-100 dark:border-green-900/30">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-200 dark:text-slate-800">
                                    <Layers className="w-8 h-8" />
                                </div>
                                <p className="text-slate-400 font-bold italic text-sm">No assignments active for this cycle.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
