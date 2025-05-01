import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '@/components/auth/SignUpForm';

describe('SignUp Form', () => {
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

  test('shows error messages when submitting empty form', async () => {
    render(<SignUpForm />);

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

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
  });

  test('shows error when passwords do not match', async () => {
    render(<SignUpForm />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.input(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    });

    fireEvent.input(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password321' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    });
  });

  test('submits form successfully when all fields are valid', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<SignUpForm />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.input(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    });

    fireEvent.input(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    });

    consoleSpy.mockRestore();
  });

  test('shows error when email format is invalid', async () => {
    render(<SignUpForm />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.input(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    });
    fireEvent.input(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });
});
