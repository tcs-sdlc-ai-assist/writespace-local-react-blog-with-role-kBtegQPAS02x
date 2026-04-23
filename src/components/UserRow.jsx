import PropTypes from 'prop-types';
import { Avatar } from './Avatar';

const ADMIN_SEED_ID = 'u_admin_001';

export function UserRow({ user, currentUser, onDelete }) {
  const isDefaultAdmin = user.id === ADMIN_SEED_ID || user.username === 'admin';
  const isSelf = currentUser && currentUser.userId === user.id;
  const deleteDisabled = isDefaultAdmin || isSelf;

  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown';

  const roleBadgeClass =
    user.role === 'admin'
      ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';

  function handleDelete() {
    if (!deleteDisabled && onDelete) {
      onDelete(user.id);
    }
  }

  let deleteTitle = 'Delete user';
  if (isDefaultAdmin) {
    deleteTitle = 'Cannot delete the default admin account';
  } else if (isSelf) {
    deleteTitle = 'Cannot delete your own account';
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <Avatar role={user.role || 'user'} size="md" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {user.displayName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            @{user.username}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass}`}
        >
          {user.role === 'admin' ? 'Admin' : 'User'}
        </span>

        <span className="hidden text-xs text-gray-500 dark:text-gray-400 sm:inline">
          {createdDate}
        </span>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteDisabled}
          title={deleteTitle}
          className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 dark:focus:ring-offset-gray-800 ${
            deleteDisabled
              ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
              : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'
          }`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    role: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string,
    displayName: PropTypes.string,
    role: PropTypes.string,
  }),
  onDelete: PropTypes.func.isRequired,
};

UserRow.defaultProps = {
  currentUser: null,
};

export default UserRow;