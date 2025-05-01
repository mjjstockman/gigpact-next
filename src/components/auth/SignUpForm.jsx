import React from 'react';
import { useForm } from 'react-hook-form';

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold text-gray-900'>
          Sign up for an account
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Username Field */}
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-900'>
              Username
            </label>
            <div className='mt-2'>
              <input
                id='username'
                name='username'
                type='text'
                className='block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600'
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && (
                <p className='text-red-600 text-sm'>
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-900'>
              Email address
            </label>
            <div className='mt-2'>
              <input
                id='email'
                name='email'
                type='email'
                className='block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600'
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className='text-red-600 text-sm'>{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-900'>
              Password
            </label>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                className='block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600'
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className='text-red-600 text-sm'>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-900'>
              Confirm Password
            </label>
            <div className='mt-2'>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                className='block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600'
                {...register('confirmPassword', {
                  required: 'Confirm your password',
                  validate: (value) =>
                    value === getValues('password') || 'Passwords must match'
                })}
              />
              {errors.confirmPassword && (
                <p className='text-red-600 text-sm'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type='submit'
              className='w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500'>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
