import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  function renderWithRouter(ui, { initialEntries = ['/protected'] } = {}) {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route path="/blogs" element={<div data-testid="blogs-page">Blogs Page</div>} />
          <Route path="/protected" element={ui} />
          <Route path="/admin" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  }

  describe('unauthenticated users', () => {
    it('should redirect to /login when no session exists', () => {
      renderWithRouter(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to /login when session is invalid JSON', () => {
      localStorage.setItem('writespace_session', 'not-valid-json');

      renderWithRouter(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to /login when session has no userId', () => {
      localStorage.setItem('writespace_session', JSON.stringify({ username: 'test' }));

      renderWithRouter(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('authenticated regular users', () => {
    const userSession = {
      userId: 'u_user_001',
      username: 'regularuser',
      displayName: 'Regular User',
      role: 'user',
    };

    it('should render children when user is authenticated and no role is required', () => {
      localStorage.setItem('writespace_session', JSON.stringify(userSession));

      renderWithRouter(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });

    it('should redirect to /blogs when non-admin user accesses admin route', () => {
      localStorage.setItem('writespace_session', JSON.stringify(userSession));

      renderWithRouter(
        <ProtectedRoute role="admin">
          <div data-testid="admin-content">Admin Content</div>
        </ProtectedRoute>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.getByTestId('blogs-page')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });
  });

  describe('authenticated admin users', () => {
    const adminSession = {
      userId: 'u_admin_001',
      username: 'admin',
      displayName: 'Administrator',
      role: 'admin',
    };

    it('should render children when admin user accesses admin route', () => {
      localStorage.setItem('writespace_session', JSON.stringify(adminSession));

      renderWithRouter(
        <ProtectedRoute role="admin">
          <div data-testid="admin-content">Admin Content</div>
        </ProtectedRoute>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.getByTestId('admin-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('blogs-page')).not.toBeInTheDocument();
    });

    it('should render children when admin user accesses non-role-restricted route', () => {
      localStorage.setItem('writespace_session', JSON.stringify(adminSession));

      renderWithRouter(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('role prop variations', () => {
    it('should render children when role prop is null and user is authenticated', () => {
      const userSession = {
        userId: 'u_user_002',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(userSession));

      renderWithRouter(
        <ProtectedRoute role={null}>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should redirect unauthenticated user to /login even when role is admin', () => {
      renderWithRouter(
        <ProtectedRoute role="admin">
          <div data-testid="admin-content">Admin Content</div>
        </ProtectedRoute>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });
  });
});