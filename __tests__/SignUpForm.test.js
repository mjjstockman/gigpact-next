import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react';
import SignUpForm from '@/components/auth/SignUpForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUpSchema } from '@/schemas/signUpSchema';
import userEvent from '@testing-library/user-event';

describe('SignUp Form', () => {
  describe('Rendering', () => {
    it('renders username, email, password, confirm password inputs, and register button', () => {
      render(<SignUpForm />);

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Sign Up/i })
      ).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('submits form successfully when all fields are valid', async () => {
      const mockSubmit = jest.fn();

      render(<SignUpForm onSubmit={mockSubmit} />);

      await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByTestId('password-input'), 'Password1!');
      await userEvent.type(
        screen.getByTestId('confirmPassword-input'),
        'Password1!'
      );

      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

      // Wait for async form submission
      await waitFor(() =>
        expect(mockSubmit).toHaveBeenCalledWith({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password1!',
          confirmPassword: 'Password1!'
        })
      );
    });

    it('displays a success message after successful submission', async () => {
      const mockSubmit = jest.fn().mockResolvedValueOnce(); // simulate success
  
      render(<SignUpForm onSubmit={mockSubmit} />);
  
      // Fill out form with valid data
      await userEvent.type(screen.getByLabelText(/username/i), 'validuser');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByTestId('password-input'), 'Password1!');
await userEvent.type(screen.getByTestId('confirmPassword-input'), 'Password1!');

  
      // Submit form
      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
  
      // Wait for success message to appear
      const successMessage = await screen.findByRole('alert');
      expect(successMessage).toHaveTextContent('Account created successfully!');
    });

    it('shows error when email format is invalid', async () => {
      const mockOnSubmit = jest.fn();
      render(<SignUpForm onSubmit={mockOnSubmit} />);

      fireEvent.input(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' }
      });
      fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'invalid-email' }
      });
      fireEvent.input(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password1!' }
      });
      fireEvent.input(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password1!' }
      });

      const signUpButton = await screen.findByRole('button', {
        name: /sign up/i
      });
      fireEvent.click(signUpButton);

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });

      const emailError = await screen.findByText('Invalid email format');
      expect(emailError).toBeInTheDocument();
    });

    it('shows error when username is already taken', async () => {
      const mockOnSubmit = jest.fn(async (data) => {
        if (data.username === 'takenuser') {
          throw { response: { data: { error: 'Username is already taken' } } };
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      });
      render(<SignUpForm onSubmit={mockOnSubmit} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirmPassword-input');
      const signUpButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(usernameInput, { target: { value: 'takenuser' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password1!' } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'Password1!' }
      });

      await waitFor(() => expect(signUpButton).not.toBeDisabled());
      fireEvent.click(signUpButton);

      const errorMessage = await screen.findByText(
        /username is already taken/i
      );
      expect(errorMessage).toBeInTheDocument();
    });

    it('displays and removes spinner overlay during form submission', async () => {
      const mockOnSubmit = jest.fn(
        () => new Promise((res) => setTimeout(res, 500))
      );

      render(<SignUpForm onSubmit={mockOnSubmit} />);

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByTestId('password-input'), {
        target: { value: 'Password123!' }
      });
      fireEvent.change(screen.getByTestId('confirmPassword-input'), {
        target: { value: 'Password123!' }
      });

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      expect(await screen.findByTestId('spinner-overlay')).toBeInTheDocument();

      await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());

      await waitFor(() => {
        expect(screen.queryByTestId('spinner-overlay')).not.toBeInTheDocument();
      });
    });

    test('shows error when email is already taken', async () => {
      const mockOnSubmit = jest.fn();

      mockOnSubmit.mockRejectedValue({
        response: {
          data: {
            error: 'This email is already taken' 
          }
        }
      });

      render(<SignUpForm onSubmit={mockOnSubmit} />);

      fireEvent.input(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' }
      });
      fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });

      fireEvent.input(screen.getByTestId('password-input'), {
        target: { value: 'Password1!' }
      });
      fireEvent.input(screen.getByTestId('confirmPassword-input'), {
        target: { value: 'Password1!' }
      });

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/this email is already taken/i)
        ).toBeInTheDocument();
      });
    });

    it('should disable submit button while submitting', async () => {
      const mockOnSubmit = jest.fn(async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        console.log('onSubmit called with:', data);
      });
      render(<SignUpForm onSubmit={mockOnSubmit} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirmPassword-input');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password1!' } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'Password1!' }
      });

      await waitFor(() => expect(submitButton).not.toBeDisabled());
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());
      await waitFor(() => expect(submitButton).toBeDisabled());
    });

    test('resets the form after successful submission', async () => {
      const mockOnSubmit = jest.fn(() => Promise.resolve());
      render(<SignUpForm onSubmit={mockOnSubmit} />);

      fireEvent.input(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' }
      });
      fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.input(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password1!' }
      });
      fireEvent.input(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password1!' }
      });

      const signUpButton = await screen.findByRole('button', {
        name: /sign up/i
      });
      fireEvent.click(signUpButton);

      await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());
      await waitFor(() => {
        expect(screen.getByLabelText(/username/i).value).toBe('');
        expect(screen.getByLabelText(/email/i).value).toBe('');
        expect(screen.getByLabelText(/^password$/i).value).toBe('');
        expect(screen.getByLabelText(/confirm password/i).value).toBe('');
      });
    });
  });

  describe('Input Validation Errors', () => {
    test('shows error messages when submitting empty form', async () => {
      const mockOnSubmit = jest.fn();
      render(<SignUpForm onSubmit={mockOnSubmit} />);

      const signUpButton = await screen.findByRole('button', {
        name: /sign up/i
      });
      fireEvent.click(signUpButton);

      await waitFor(() => {
        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(
          screen.getByText(/password must be at least 8 characters/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/please confirm your password/i)
        ).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('shows error when passwords do not match', async () => {
      render(<SignUpForm onSubmit={jest.fn()} />);

      fireEvent.input(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' }
      });
      fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.input(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password1!' }
      });
      fireEvent.input(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Different!' }
      });

      const signUpButton = await screen.findByRole('button', {
        name: /sign up/i
      });
      fireEvent.click(signUpButton);

      const passwordMismatchError = await screen.findByText(
        /passwords must match/i
      );
      expect(passwordMismatchError).toBeInTheDocument();
    });

    test('shows error when password does not contain an uppercase letter', async () => {
      render(<SignUpForm onSubmit={jest.fn()} />);

      fireEvent.input(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' }
      });

      fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });

      fireEvent.input(screen.getByLabelText(/^password$/i), {
        target: { value: 'password123!' }
      });

      fireEvent.input(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123!' }
      });

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(
          screen.getByText((text) =>
            text.includes('Password must contain at least one uppercase letter')
          )
        ).toBeInTheDocument();
      });
    });

    test('shows error when password does not contain a lowercase letter', async () => {
      render(<SignUpForm onSubmit={jest.fn()} />);

      fireEvent.input(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' }
      });

      fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });

      fireEvent.input(screen.getByLabelText(/^password$/i), {
        target: { value: 'PASSWORD123!' }
      });

      fireEvent.input(screen.getByLabelText(/confirm password/i), {
        target: { value: 'PASSWORD123!' }
      });

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(
          screen.getByText(
            (content, node) =>
              node?.textContent ===
              'Password must contain at least one lowercase letter'
          )
        ).toBeInTheDocument();
      });
    });

    test('shows error when password does not contain a number', async () => {
      render(<SignUpForm onSubmit={jest.fn()} />);

      fireEvent.input(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' }
      });

      fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });

      fireEvent.input(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password!' } 
      });

      fireEvent.input(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password!' }
      });

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/password must contain at least one number/i)
        ).toBeInTheDocument();
      });
    });
  });
  describe('Accessibility & UX Enhancements', () => {
    it('focuses the first invalid input on submit', async () => {
      render(<SignUpForm onSubmit={jest.fn()} />);
  
      const usernameInput = screen.getByLabelText(/username/i);
      await userEvent.type(usernameInput, 'validusername');
  
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'invalidemail');
  
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await userEvent.click(submitButton);
  
      await waitFor(() => {
        expect(document.activeElement).toBe(emailInput);  
  
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });
  
});
