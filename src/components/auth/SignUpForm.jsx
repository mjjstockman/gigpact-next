function SignUpForm() {
  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <img
          alt='Your Company'
          src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
          className='mx-auto h-10 w-auto'
        />
        <h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-gray-900'>
          Create a new account
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form action='#' method='POST' className='space-y-6'>
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
                required
                className='input input-bordered w-full'
              />
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
                required
                autoComplete='email'
                className='input input-bordered w-full'
              />
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
                required
                autoComplete='new-password'
                className='input input-bordered w-full'
              />
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
                required
                autoComplete='new-password'
                className='input input-bordered w-full'
              />
            </div>
          </div>

          {/* Sign Up Button */}
          <div>
            <button type='submit' className='btn btn-indigo w-full'>
              Sign Up
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className='mt-10 text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <a
            href='#'
            className='font-semibold text-indigo-600 hover:text-indigo-500'>
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
