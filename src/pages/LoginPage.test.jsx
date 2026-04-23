import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage.jsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../utils/auth.js', async () => {
  const actual = await vi.importActual('../utils/auth.js');
  return {
    ...actual,
    login: vi.fn(),
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
  };
});

import { login, isAuthenticated, getCurrentUser } from '../utils/auth.js';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    isAuthenticated.mockReturnValue(false);
    getCurrentUser.mockReturnValue(null);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  function renderLoginPage() {
    return render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    );
  }

  describe('form rendering', () => {
    it('should render the login form with username and password fields', () => {
      renderLoginPage();

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should render the sign in button', () => {
      renderLoginPage();

      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render the WriteSpace brand link', () => {
      renderLoginPage();

      expect(screen.getByText('WriteSpace')).toBeInTheDocument();
    });

    it('should render a link to the register page', () => {
      renderLoginPage();

      const registerLink = screen.getByRole('link', { name: /create one/i });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('should render the sign in description text', () => {
      renderLoginPage();

      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    });
  });

  describe('validation and error display', () => {
    it('should display error message on failed login', async () => {
      login.mockReturnValue({ success: false, error: 'Invalid username or password' });

      renderLoginPage();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/username/i), 'wronguser');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Invalid username or password');
    });

    it('should display generic error when login returns no error message', async () => {
      login.mockReturnValue({ success: false });

      renderLoginPage();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'testpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Login failed. Please try again.');
    });

    it('should call login with trimmed username', async () => {
      login.mockReturnValue({ success: false, error: 'Invalid username or password' });

      renderLoginPage();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/username/i), '  admin  ');
      await user.type(screen.getByLabelText(/password/i), 'admin123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(login).toHaveBeenCalledWith({ username: 'admin', password: 'admin123' });
    });
  });

  describe('successful login redirect by role', () => {
    it('should navigate to /admin when admin logs in successfully', async () => {
      login.mockReturnValue({
        success: true,
        session: {
          userId: 'u_admin_001',
          username: 'admin',
          displayName: 'Administrator',
          role: 'admin',
        },
      });

      renderLoginPage();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/username/i), 'admin');
      await user.type(screen.getByLabelText(/password/i), 'admin123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });

    it('should navigate to /blogs when regular user logs in successfully', async () => {
      login.mockReturnValue({
        success: true,
        session: {
          userId: 'u_user_001',
          username: 'testuser',
          displayName: 'Test User',
          role: 'user',
        },
      });

      renderLoginPage();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });

    it('should navigate to /blogs when session has no role', async () => {
      login.mockReturnValue({
        success: true,
        session: {
          userId: 'u_user_002',
          username: 'norole',
          displayName: 'No Role User',
        },
      });

      renderLoginPage();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/username/i), 'norole');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });

  describe('redirect for already-authenticated users', () => {
    it('should redirect admin to /admin if already authenticated', async () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'u_admin_001',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });

      renderLoginPage();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
      });
    });

    it('should redirect regular user to /blogs if already authenticated', async () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'u_user_001',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderLoginPage();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
      });
    });

    it('should redirect to /blogs if authenticated user has no role', async () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'u_user_002',
        username: 'norole',
        displayName: 'No Role',
      });

      renderLoginPage();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
      });
    });
  });

  describe('form interaction', () => {
    it('should update username field when typing', async () => {
      renderLoginPage();
      const user = userEvent.setup();

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, 'myuser');

      expect(usernameInput).toHaveValue('myuser');
    });

    it('should update password field when typing', async () => {
      renderLoginPage();
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'mypassword');

      expect(passwordInput).toHaveValue('mypassword');
    });

    it('should not display error message initially', () => {
      renderLoginPage();

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should clear previous error when submitting again', async () => {
      login
        .mockReturnValueOnce({ success: false, error: 'Invalid username or password' })
        .mockReturnValueOnce({
          success: true,
          session: {
            userId: 'u_user_001',
            username: 'testuser',
            displayName: 'Test User',
            role: 'user',
          },
        });

      renderLoginPage();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/username/i), 'wronguser');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByRole('alert')).toBeInTheDocument();

      await user.clear(screen.getByLabelText(/username/i));
      await user.clear(screen.getByLabelText(/password/i));
      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });
});