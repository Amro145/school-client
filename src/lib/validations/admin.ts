import { z } from 'zod';
import { MAX_LENGTHS, PASSWORD_RULES, USER_ROLES } from '@shared/types/models';

export const createUserSchema = z.object({
    userName: z
        .string()
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(MAX_LENGTHS.USER_NAME, 'Username too long'),
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .max(MAX_LENGTHS.EMAIL),
    password: z
        .string()
        .min(PASSWORD_RULES.MIN, `Password must be at least ${PASSWORD_RULES.MIN} characters`)
        .regex(PASSWORD_RULES.REGEX_NUMBER, 'Password must contain at least one number')
        .regex(PASSWORD_RULES.REGEX_SPECIAL, 'Password must contain at least one special character'),
    role: z.enum(USER_ROLES),
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
        .max(MAX_LENGTHS.CLASS_NAME, 'Class name too long'),
});

export type CreateClassFormValues = z.infer<typeof createClassSchema>;

export const createSubjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Subject name must be at least 2 characters')
        .max(MAX_LENGTHS.SUBJECT_NAME, 'Subject name too long'),
    teacherId: z.string().min(1, 'Teacher assignment is required'),
    classId: z.string().min(1, 'Class assignment is required'),
});

export type CreateSubjectFormValues = z.infer<typeof createSubjectSchema>;
