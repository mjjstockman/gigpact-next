import React, { useState, useEffect, useCallback } from 'react';

const SignUpForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('SignUpForm rendered'); // Logs once when the form first mounts
  }, []); // Ensures this only runs once (on mount)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      await onSubmit(formData);
      console.log(formData);
    } catch (error) {
      if (
        error.response &&
        error.response.data.error === 'Username is already taken'
      ) {
        setErrors({ username: 'Username is already taken' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='relative'>
      <form onSubmit={handleSubmit} noValidate className='space-y-4'>
        <div>
          <label htmlFor='username'>Username</label>
          <input
            id='username'
            name='username'
            type='text'
            value={formData.username}
            onChange={handleChange}
            className='input input-bordered w-full'
            disabled={isSubmitting}
          />
          {errors.username && (
            <p role='alert' className='text-red-500'>
              {errors.username}
            </p>
          )}
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            className='input input-bordered w-full'
            disabled={isSubmitting}
          />
          {errors.email && (
            <p role='alert' className='text-red-500'>
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            className='input input-bordered w-full'
            disabled={isSubmitting}
          />
          {errors.password && (
            <p role='alert' className='text-red-500'>
              {errors.password}
            </p>
          )}
        </div>
        <div>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={handleChange}
            className='input input-bordered w-full'
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p role='alert' className='text-red-500'>
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <button
          type='submit'
          className='btn btn-primary w-full'
          disabled={isSubmitting}>
          Sign Up
        </button>
      </form>

      {isSubmitting && (
        <div
          data-testid='spinner-overlay'
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='loading loading-spinner loading-lg text-primary'></div>
          <span className='sr-only'>Loading...</span>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;
