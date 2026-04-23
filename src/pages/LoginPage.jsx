import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isAuthenticated, getCurrentUser } from '../utils/auth.js';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      if (user && user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login({ username: username.trim(), password });

    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
      return;
    }

    if (result.session && result.session.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/blogs', { replace: true });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-surface px-4 py-12 dark:bg-gradient-surface-dark">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-block text-3xl font-bold text-writespace-600 transition-colors hover:text-writespace-700 dark:text-writespace-400 dark:hover:text-writespace-300"
          >
            WriteSpace
          </Link>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-soft dark:border-gray-700 dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-writespace-500 focus:outline-none focus:ring-2 focus:ring-writespace-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-writespace-400 dark:focus:ring-writespace-400/30"
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
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-writespace-500 focus:outline-none focus:ring-2 focus:ring-writespace-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-writespace-400 dark:focus:ring-writespace-400/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-writespace-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-writespace-700 focus:outline-none focus:ring-2 focus:ring-writespace-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-writespace-500 dark:hover:bg-writespace-600 dark:focus:ring-offset-gray-800"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-writespace-600 transition-colors hover:text-writespace-700 dark:text-writespace-400 dark:hover:text-writespace-300"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;