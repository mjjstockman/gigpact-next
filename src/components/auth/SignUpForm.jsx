import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/schemas/signUpSchema';

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor='username'>Username</label>
        <input id='username' {...register('username')} />
        {errors.username && <p role='alert'>{errors.username.message}</p>}
      </div>

      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' type='email' {...register('email')} />
        {errors.email && <p role='alert'>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' {...register('password')} />
        {errors.password && <p role='alert'>{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          id='confirmPassword'
          type='password'
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p role='alert'>{errors.confirmPassword.message}</p>
        )}
      </div>

      <button type='submit'>Sign Up</button>
    </form>
  );
};

export default SignUpForm;
