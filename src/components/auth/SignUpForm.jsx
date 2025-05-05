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
        <input id='username' {...register('username')} onBlur={() => {}} />
        {errors.username && <p>{errors.username.message}</p>}
      </div>

      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' {...register('email')} onBlur={() => {}} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          data-testid='password-input'
          type='password'
          {...register('password')}
          onBlur={() => {}}
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
          onBlur={() => {}}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      {networkError && (
        <p role="alert" data-testid="network-error">{networkError}</p>
      )}

      {successMessage && (
        <p role="alert" data-testid="success-message">{successMessage}</p>
      )}

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
