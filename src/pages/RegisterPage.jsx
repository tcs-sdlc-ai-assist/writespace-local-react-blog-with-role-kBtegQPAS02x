import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addUser } from '../utils/storage.js';
import { login, isAuthenticated } from '../utils/auth.js';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/blogs', { replace: true });
    }
  }, [navigate]);

  function validate() {
    if (!displayName || displayName.trim().length < 2) {
      return 'Display name must be at least 2 characters';
    }
    if (!username || username.trim().length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const addResult = addUser({
      username: username.trim(),
      displayName: displayName.trim(),
      password,
      role: 'user',
    });

    if (!addResult.success) {
      setError(addResult.error || 'Registration failed');
      setLoading(false);
      return;
    }

    const loginResult = login({ username: username.trim(), password });

    if (!loginResult.success) {
      setError(loginResult.error || 'Registration succeeded but auto-login failed. Please log in manually.');
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate('/blogs', { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-surface px-4 py-12 dark:bg-gradient-surface-dark">
      <div className="w-full max-w-md animate-fade-in">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-soft dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-block text-2xl font-bold text-writespace-600 dark:text-writespace-400"
            >
              WriteSpace
            </Link>
            <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Join WriteSpace and start writing today
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="displayName"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-writespace-500 focus:outline-none focus:ring-2 focus:ring-writespace-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-writespace-400 dark:focus:ring-writespace-400/30"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                autoComplete="username"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-writespace-500 focus:outline-none focus:ring-2 focus:ring-writespace-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-writespace-400 dark:focus:ring-writespace-400/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-writespace-500 focus:outline-none focus:ring-2 focus:ring-writespace-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-writespace-400 dark:focus:ring-writespace-400/30"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-writespace-500 focus:outline-none focus:ring-2 focus:ring-writespace-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-writespace-400 dark:focus:ring-writespace-400/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-writespace-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-writespace-700 focus:outline-none focus:ring-2 focus:ring-writespace-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-writespace-500 dark:hover:bg-writespace-600 dark:focus:ring-offset-gray-800"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-writespace-600 hover:text-writespace-700 dark:text-writespace-400 dark:hover:text-writespace-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}