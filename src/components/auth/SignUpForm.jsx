import React, { useState } from 'react';

const SignUpForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
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
      return;
    }

    // Clear errors and call the onSubmit prop if validation passes
    setErrors({});
    onSubmit(formData); // Submit the form
    console.log(formData); // Log the form data without the "Submitted data:" prefix
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor='username'>Username</label>
        <input
          id='username'
          name='username'
          type='text'
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p role='alert'>{errors.username}</p>}
      </div>
      <div>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p role='alert'>{errors.email}</p>}
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p role='alert'>{errors.password}</p>}
      </div>
      <div>
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p role='alert'>{errors.confirmPassword}</p>}
      </div>
      <button type='submit'>Sign Up</button>
    </form>
  );
};

export default SignUpForm;
