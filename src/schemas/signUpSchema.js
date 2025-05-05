import { z } from 'zod';

export const signUpSchema = z
  .object({
    username: z.string().trim().min(1, 'Username is required'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Invalid email format'), // Async check removed
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter'
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter'
      })
      .refine((val) => /\d/.test(val), {
        message: 'Password must contain at least one number'
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: 'Password must contain at least one special character'
      }),
    confirmPassword: z.string().trim().min(1, 'Please confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  });
