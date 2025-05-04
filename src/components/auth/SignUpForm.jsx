import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// import signUpSchema from '@/schemas/signUpSchema';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm({ onSubmit }) {
  const [networkError, setNetworkError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(signUpSchema) // Use the imported schema
  });

  const onFormSubmit = async (data) => {
    setNetworkError('');
    try {
      await onSubmit(data);
      reset();
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        'We encountered an issue. Please check your connection and try again.';
      setNetworkError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <div>
        <label htmlFor='username'>Username</label>
        <input id='username' {...register('username')} />
        {errors.username && <p>{errors.username.message}</p>}
      </div>

      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          data-testid='password-input'
          type='password'
          {...register('password')}
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          id='confirmPassword'
          data-testid='confirmPassword-input'
          type='password'
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      {networkError && <p>{networkError}</p>}

      <button type='submit' disabled={isSubmitting}>
        Sign Up
      </button>

      {isSubmitting && (
        <div data-testid='spinner-overlay'>
          <p>Submitting...</p>
        </div>
      )}
    </form>
  );
}
