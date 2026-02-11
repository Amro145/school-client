import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Administrative email is required')
        .email('Please enter a valid administrative email address'),
    password: z
        .string()
        .min(8, 'Secret key must be at least 8 characters')
        .regex(/[0-9]/, 'Secret key must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Secret key must contain at least one special character'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const schoolSetupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'School name must be at least 3 characters')
        .max(100, 'School name too long (max 100 characters)'),
});

export type SchoolSetupFormValues = z.infer<typeof schoolSetupSchema>;
