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
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/confirm your password/i)).toBeInTheDocument();
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
});
