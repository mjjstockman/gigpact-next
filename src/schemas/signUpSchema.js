import { z } from 'zod';

export const signUpSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email format'), // This will automatically check for both empty and invalid email
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match'
  });
