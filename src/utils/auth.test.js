import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('auth utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  async function loadAuth() {
    const mod = await import('./auth.js');
    return mod;
  }

  async function loadStorage() {
    const mod = await import('./storage.js');
    return mod;
  }

  describe('login', () => {
    it('should login successfully with valid admin credentials', async () => {
      const auth = await loadAuth();
      const result = auth.login({ username: 'admin', password: 'admin123' });
      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();
      expect(result.session.userId).toBe('u_admin_001');
      expect(result.session.username).toBe('admin');
      expect(result.session.displayName).toBe('Administrator');
      expect(result.session.role).toBe('admin');
    });

    it('should login successfully with a registered user', async () => {
      const storage = await loadStorage();
      storage.addUser({
        username: 'testuser',
        displayName: 'Test User',
        password: 'password123',
      });
      const auth = await loadAuth();
      const result = auth.login({ username: 'testuser', password: 'password123' });
      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();
      expect(result.session.username).toBe('testuser');
      expect(result.session.displayName).toBe('Test User');
      expect(result.session.role).toBe('user');
    });

    it('should fail with incorrect password', async () => {
      const auth = await loadAuth();
      const result = auth.login({ username: 'admin', password: 'wrongpassword' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or password');
      expect(result.session).toBeUndefined();
    });

    it('should fail with non-existent username', async () => {
      const auth = await loadAuth();
      const result = auth.login({ username: 'nonexistent', password: 'password123' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or password');
    });

    it('should fail when username is empty', async () => {
      const auth = await loadAuth();
      const result = auth.login({ username: '', password: 'password123' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is required');
    });

    it('should fail when username is not provided', async () => {
      const auth = await loadAuth();
      const result = auth.login({ username: undefined, password: 'password123' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is required');
    });

    it('should fail when username is null', async () => {
      const auth = await loadAuth();
      const result = auth.login({ username: null, password: 'password123' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is required');
    });

    it('should fail when username is only whitespace', async () => {
      const auth = await loadAuth();
      const result = auth.login({ username: '   ', password: 'password123' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is required');
    });

    it('should fail when password is empty', async () => {
      const auth = await loadAuth();
      const result = auth.login({ username: 'admin', password: '' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should fail when password is not provided', async () => {
      const auth = await loadAuth();
      const result = auth.login({ username: 'admin', password: undefined });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should fail when password is null', async () => {
      const auth = await loadAuth();
      const result = auth.login({ username: 'admin', password: null });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should persist session to localStorage on successful login', async () => {
      const auth = await loadAuth();
      auth.login({ username: 'admin', password: 'admin123' });
      const raw = localStorage.getItem('writespace_session');
      expect(raw).not.toBeNull();
      const session = JSON.parse(raw);
      expect(session.userId).toBe('u_admin_001');
      expect(session.username).toBe('admin');
    });

    it('should not persist session on failed login', async () => {
      const auth = await loadAuth();
      auth.login({ username: 'admin', password: 'wrongpassword' });
      const raw = localStorage.getItem('writespace_session');
      expect(raw).toBeNull();
    });

    it('should trim username before matching', async () => {
      const auth = await loadAuth();
      const result = auth.login({ username: '  admin  ', password: 'admin123' });
      expect(result.success).toBe(true);
      expect(result.session.username).toBe('admin');
    });
  });

  describe('logout', () => {
    it('should clear the session from localStorage', async () => {
      const auth = await loadAuth();
      auth.login({ username: 'admin', password: 'admin123' });
      expect(localStorage.getItem('writespace_session')).not.toBeNull();
      auth.logout();
      expect(localStorage.getItem('writespace_session')).toBeNull();
    });

    it('should not throw when no session exists', async () => {
      const auth = await loadAuth();
      expect(() => auth.logout()).not.toThrow();
    });

    it('should make isAuthenticated return false after logout', async () => {
      const auth = await loadAuth();
      auth.login({ username: 'admin', password: 'admin123' });
      expect(auth.isAuthenticated()).toBe(true);
      auth.logout();
      expect(auth.isAuthenticated()).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no session exists', async () => {
      const auth = await loadAuth();
      expect(auth.isAuthenticated()).toBe(false);
    });

    it('should return true after successful login', async () => {
      const auth = await loadAuth();
      auth.login({ username: 'admin', password: 'admin123' });
      expect(auth.isAuthenticated()).toBe(true);
    });

    it('should return false after logout', async () => {
      const auth = await loadAuth();
      auth.login({ username: 'admin', password: 'admin123' });
      auth.logout();
      expect(auth.isAuthenticated()).toBe(false);
    });

    it('should return true when a valid session exists in localStorage', async () => {
      const sessionData = {
        userId: 'u_test_001',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(sessionData));
      const auth = await loadAuth();
      expect(auth.isAuthenticated()).toBe(true);
    });

    it('should return false when session in localStorage is invalid', async () => {
      localStorage.setItem('writespace_session', 'not-json');
      const auth = await loadAuth();
      expect(auth.isAuthenticated()).toBe(false);
    });

    it('should return false when session has no userId', async () => {
      localStorage.setItem('writespace_session', JSON.stringify({ username: 'test' }));
      const auth = await loadAuth();
      expect(auth.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no session exists', async () => {
      const auth = await loadAuth();
      expect(auth.getCurrentUser()).toBeNull();
    });

    it('should return session data after successful login', async () => {
      const auth = await loadAuth();
      auth.login({ username: 'admin', password: 'admin123' });
      const user = auth.getCurrentUser();
      expect(user).not.toBeNull();
      expect(user.userId).toBe('u_admin_001');
      expect(user.username).toBe('admin');
      expect(user.displayName).toBe('Administrator');
      expect(user.role).toBe('admin');
    });

    it('should return null after logout', async () => {
      const auth = await loadAuth();
      auth.login({ username: 'admin', password: 'admin123' });
      auth.logout();
      expect(auth.getCurrentUser()).toBeNull();
    });

    it('should return session from localStorage when manually set', async () => {
      const sessionData = {
        userId: 'u_manual_001',
        username: 'manualuser',
        displayName: 'Manual User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(sessionData));
      const auth = await loadAuth();
      const user = auth.getCurrentUser();
      expect(user).toEqual(sessionData);
    });

    it('should return null when session in localStorage is invalid JSON', async () => {
      localStorage.setItem('writespace_session', 'invalid-json');
      const auth = await loadAuth();
      expect(auth.getCurrentUser()).toBeNull();
    });

    it('should return null when session object has no userId', async () => {
      localStorage.setItem('writespace_session', JSON.stringify({ username: 'test' }));
      const auth = await loadAuth();
      expect(auth.getCurrentUser()).toBeNull();
    });
  });

  describe('isAdmin', () => {
    it('should return false when no session exists', async () => {
      const auth = await loadAuth();
      expect(auth.isAdmin()).toBe(false);
    });

    it('should return true when logged in as admin', async () => {
      const auth = await loadAuth();
      auth.login({ username: 'admin', password: 'admin123' });
      expect(auth.isAdmin()).toBe(true);
    });

    it('should return false when logged in as regular user', async () => {
      const storage = await loadStorage();
      storage.addUser({
        username: 'regularuser',
        displayName: 'Regular User',
        password: 'password123',
      });
      const auth = await loadAuth();
      auth.login({ username: 'regularuser', password: 'password123' });
      expect(auth.isAdmin()).toBe(false);
    });

    it('should return false after admin logs out', async () => {
      const auth = await loadAuth();
      auth.login({ username: 'admin', password: 'admin123' });
      expect(auth.isAdmin()).toBe(true);
      auth.logout();
      expect(auth.isAdmin()).toBe(false);
    });

    it('should return true when session with admin role exists in localStorage', async () => {
      const sessionData = {
        userId: 'u_admin_custom',
        username: 'customadmin',
        displayName: 'Custom Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(sessionData));
      const auth = await loadAuth();
      expect(auth.isAdmin()).toBe(true);
    });

    it('should return false when session with user role exists in localStorage', async () => {
      const sessionData = {
        userId: 'u_user_001',
        username: 'normaluser',
        displayName: 'Normal User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(sessionData));
      const auth = await loadAuth();
      expect(auth.isAdmin()).toBe(false);
    });

    it('should return false when session in localStorage is invalid', async () => {
      localStorage.setItem('writespace_session', 'not-valid-json');
      const auth = await loadAuth();
      expect(auth.isAdmin()).toBe(false);
    });
  });

  describe('login and session integration', () => {
    it('should overwrite previous session on new login', async () => {
      const storage = await loadStorage();
      storage.addUser({
        username: 'user1',
        displayName: 'User One',
        password: 'password123',
      });
      storage.addUser({
        username: 'user2',
        displayName: 'User Two',
        password: 'password456',
      });

      const auth = await loadAuth();

      auth.login({ username: 'user1', password: 'password123' });
      expect(auth.getCurrentUser().username).toBe('user1');

      auth.login({ username: 'user2', password: 'password456' });
      expect(auth.getCurrentUser().username).toBe('user2');
    });

    it('should not overwrite session on failed login attempt', async () => {
      const auth = await loadAuth();
      auth.login({ username: 'admin', password: 'admin123' });
      expect(auth.getCurrentUser().username).toBe('admin');

      const result = auth.login({ username: 'admin', password: 'wrongpassword' });
      expect(result.success).toBe(false);
      expect(auth.getCurrentUser().username).toBe('admin');
    });

    it('should return correct role after switching users', async () => {
      const storage = await loadStorage();
      storage.addUser({
        username: 'regularuser',
        displayName: 'Regular User',
        password: 'password123',
      });

      const auth = await loadAuth();

      auth.login({ username: 'admin', password: 'admin123' });
      expect(auth.isAdmin()).toBe(true);

      auth.logout();
      auth.login({ username: 'regularuser', password: 'password123' });
      expect(auth.isAdmin()).toBe(false);
      expect(auth.isAuthenticated()).toBe(true);
    });
  });
});