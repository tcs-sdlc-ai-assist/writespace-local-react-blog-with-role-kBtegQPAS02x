import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAdmin } from '../utils/auth.js';
import { getUsers, addUser, removeUser } from '../utils/storage.js';
import { UserRow } from '../components/UserRow.jsx';

export function UserManagement() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!currentUser || !isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = useCallback(() => {
    const allUsers = getUsers();
    setUsers(allUsers);
  }, []);

  function handleCreateUser(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!displayName || displayName.trim().length < 2) {
      setFormError('Display name must be at least 2 characters');
      return;
    }

    if (!username || username.trim().length < 3) {
      setFormError('Username must be at least 3 characters');
      return;
    }

    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    const result = addUser({
      username: username.trim(),
      displayName: displayName.trim(),
      password,
      role: 'user',
    });

    if (!result.success) {
      setFormError(result.error || 'Failed to create user');
      return;
    }

    setFormSuccess(`User "${result.user.displayName}" created successfully`);
    setDisplayName('');
    setUsername('');
    setPassword('');
    loadUsers();

    setTimeout(() => {
      setFormSuccess('');
    }, 3000);
  }

  function handleDeleteRequest(userId) {
    setDeleteError('');
    setDeleteConfirmId(userId);
  }

  function handleDeleteConfirm() {
    if (!deleteConfirmId) return;

    const result = removeUser(deleteConfirmId);
    if (!result.success) {
      setDeleteError(result.error || 'Failed to delete user');
      setDeleteConfirmId(null);
      setTimeout(() => {
        setDeleteError('');
      }, 3000);
      return;
    }

    setDeleteConfirmId(null);
    setDeleteError('');
    loadUsers();
  }

  function handleDeleteCancel() {
    setDeleteConfirmId(null);
    setDeleteError('');
  }

  if (!currentUser || !isAdmin()) {
    return null;
  }

  const deleteTargetUser = deleteConfirmId
    ? users.find((u) => u.id === deleteConfirmId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create and manage user accounts for WriteSpace.
          </p>
        </div>

        {/* Create User Form */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Create New User
          </h2>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="displayName"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-writespace-500 focus:outline-none focus:ring-2 focus:ring-writespace-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-writespace-400"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-writespace-500 focus:outline-none focus:ring-2 focus:ring-writespace-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-writespace-400"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-writespace-500 focus:outline-none focus:ring-2 focus:ring-writespace-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-writespace-400"
                />
              </div>
            </div>

            {formError && (
              <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                {formSuccess}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-writespace-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-writespace-700 focus:outline-none focus:ring-2 focus:ring-writespace-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Delete Error */}
        {deleteError && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {deleteError}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && deleteTargetUser && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-700 dark:text-red-400">
              Are you sure you want to delete user{' '}
              <span className="font-semibold">
                {deleteTargetUser.displayName}
              </span>{' '}
              (@{deleteTargetUser.username})? This action cannot be undone.
            </p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={handleDeleteCancel}
                className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Users
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {users.length} {users.length === 1 ? 'user' : 'users'}
            </span>
          </div>

          {users.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No users found.
            </p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  currentUser={currentUser}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;