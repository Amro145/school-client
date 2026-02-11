import { z } from 'zod';
import { MAX_LENGTHS, PASSWORD_RULES } from '@shared/types/models';

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .max(MAX_LENGTHS.EMAIL),
    password: z
        .string()
        .trim()
        .min(PASSWORD_RULES.MIN, `Password must be at least ${PASSWORD_RULES.MIN} characters`)
        .regex(PASSWORD_RULES.REGEX_NUMBER, 'Password must contain at least one number')
        .regex(PASSWORD_RULES.REGEX_SPECIAL, 'Password must contain at least one special character'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const schoolSetupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'School name must be at least 3 characters')
        .max(MAX_LENGTHS.SCHOOL_NAME, `School name too long (max ${MAX_LENGTHS.SCHOOL_NAME} characters)`),
});

export type SchoolSetupFormValues = z.infer<typeof schoolSetupSchema>;
