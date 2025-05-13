import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm({ onSubmit }) {
  const [networkError, setNetworkError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur'
  });

  const onFormSubmit = async (data) => {
    setNetworkError('');
    setSuccessMessage('');
    try {
      await onSubmit(data);
      reset();
      setSuccessMessage('Account created successfully!');
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
        <input
          id='username'
          type='text'
          autoComplete='username'
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? 'username-error' : undefined}
          {...register('username')}
        />
        {errors.username && (
          <p id='username-error' role='alert'>
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          autoComplete='email'
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id='email-error' role='alert'>
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          data-testid='password-input'
          type='password'
          autoComplete='new-password'
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
        />
        {errors.password && (
          <p id='password-error' role='alert'>
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          id='confirmPassword'
          data-testid='confirmPassword-input'
          type='password'
          autoComplete='new-password'
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={
            errors.confirmPassword ? 'confirmPassword-error' : undefined
          }
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p id='confirmPassword-error' role='alert'>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {networkError && (
        <p role='alert' data-testid='network-error'>
          {networkError}
        </p>
      )}

      {successMessage && (
        <p role='alert' data-testid='success-message'>
          {successMessage}
        </p>
      )}

      <button type='submit' disabled={isSubmitting}>
        Sign Up
      </button>

      {isSubmitting && (
        <div data-testid='spinner-overlay' aria-live='polite'>
          <p>Submitting...</p>
        </div>
      )}
    </form>
  );
}
