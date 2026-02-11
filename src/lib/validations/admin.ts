import { z } from 'zod';

export const createUserSchema = z.object({
    userName: z
        .string()
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username too long'),
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    role: z.enum(['student', 'teacher', 'admin']),
    classId: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.role === 'student' && (!data.classId || data.classId === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Curricular assignment is required for students",
            path: ["classId"],
        });
    }
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const createClassSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Class name must be at least 2 characters')
        .max(50, 'Class name too long'),
});

export type CreateClassFormValues = z.infer<typeof createClassSchema>;

export const createSubjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Subject name must be at least 2 characters')
        .max(50, 'Subject name too long'),
    teacherId: z.string().min(1, 'Teacher assignment is required'),
    classId: z.string().min(1, 'Class assignment is required'),
});

export type CreateSubjectFormValues = z.infer<typeof createSubjectSchema>;
