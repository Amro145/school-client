import { z } from 'zod';

export const examSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, 'Exam title must be at least 5 characters')
        .max(100, 'Exam title too long'),
    type: z.enum(['Midterm', 'Final', 'Quiz']),
    description: z
        .string()
        .trim()
        .min(10, 'Please provide a more detailed description')
        .max(500, 'Description too long'),
    durationInMinutes: z
        .number()
        .min(5, 'Duration must be at least 5 minutes')
        .max(240, 'Duration cannot exceed 4 hours (240 minutes)'),
    classId: z.string().min(1, 'Please select a target class'),
    subjectId: z.string().min(1, 'Please select a subject'),
    questions: z.array(z.object({
        questionText: z
            .string()
            .trim()
            .min(5, 'Question text must be at least 5 characters'),
        options: z
            .array(z.string().trim().min(1, 'Option cannot be empty'))
            .length(4, 'Each question must have exactly 4 options'),
        correctAnswerIndex: z
            .number()
            .min(0)
            .max(3),
        points: z
            .number()
            .min(1, 'Points must be at least 1')
            .max(100, 'Points cannot exceed 100 per question'),
    })).min(1, 'At least one question is required'),
});

export type ExamFormValues = z.infer<typeof examSchema>;

export const scheduleSchema = z.object({
    subjectId: z.string().min(1, 'Subject assignment is required'),
    day: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']),
    startTime: z.string().min(1, 'Start time is required'),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;
