import { getUsers, getSession, setSession, clearSession } from './storage.js';

/**
 * Attempt to log in with the given credentials.
 * Validates username and password against localStorage users.
 * On success, creates a session and returns it.
 *
 * @param {{ username: string, password: string }} credentials
 * @returns {{ success: boolean, session?: Object, error?: string }}
 */
export function login({ username, password }) {
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return { success: false, error: 'Username is required' };
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return { success: false, error: 'Password is required' };
  }

  const users = getUsers();
  const user = users.find(
    (u) => u.username === username.trim() && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Invalid username or password' };
  }

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };

  setSession(session);

  return { success: true, session };
}

/**
 * Log out the current user by clearing the session from localStorage.
 * @returns {void}
 */
export function logout() {
  clearSession();
}

/**
 * Check whether a user is currently authenticated (has a valid session).
 * @returns {boolean}
 */
export function isAuthenticated() {
  const session = getSession();
  return session !== null;
}

/**
 * Get the current authenticated user's session data.
 * Returns null if no session exists.
 * @returns {{ userId: string, username: string, displayName: string, role: string } | null}
 */
export function getCurrentUser() {
  return getSession();
}

/**
 * Check whether the current authenticated user has the admin role.
 * @returns {boolean}
 */
export function isAdmin() {
  const session = getSession();
  if (!session) {
    return false;
  }
  return session.role === 'admin';
}