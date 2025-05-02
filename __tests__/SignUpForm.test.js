import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react';
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
      target: { value: 'password123' }
    });

    fireEvent.input(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password321' }
    });

    const signUpButton = await screen.findByRole('button', {
      name: /sign up/i
    });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    });
  });

  test('submits form successfully when all fields are valid', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<SignUpForm onSubmit={jest.fn()} />);

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

    const signUpButton = await screen.findByRole('button', {
      name: /sign up/i
    });
    fireEvent.click(signUpButton);

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
    const mockOnSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockOnSubmit} />);

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

  test('shows error when username is already taken', async () => {
    const mockOnSubmit = jest.fn();
    const usernameTaken = 'testuser';

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: usernameTaken }
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

    const mockResponse = {
      response: {
        data: {
          error: 'Username is already taken'
        }
      }
    };

    mockOnSubmit.mockRejectedValueOnce(mockResponse);

    const signUpButton = await screen.findByRole('button', {
      name: /sign up/i
    });
    fireEvent.click(signUpButton);

    const errorMessage = await screen.findByText(/username is already taken/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('displays spinner overlay during form submission', async () => {
    const mockOnSubmit = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    );

    render(<SignUpForm onSubmit={mockOnSubmit} />);

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

    const signUpButton = await screen.findByRole('button', {
      name: /sign up/i
    });
    fireEvent.click(signUpButton);

    // Ensure spinner is shown
    expect(screen.getByTestId('spinner-overlay')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  test('submit button is disabled while submitting', async () => {
    const mockOnSubmit = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    );

    render(<SignUpForm onSubmit={mockOnSubmit} />);

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

    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
