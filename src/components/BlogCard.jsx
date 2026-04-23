import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar } from './Avatar.jsx';

function truncateContent(content, maxLength = 150) {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.6) {
    return truncated.substring(0, lastSpace) + '…';
  }
  return truncated + '…';
}

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function BlogCard({ post, currentUser }) {
  const excerpt = truncateContent(post.content);
  const formattedDate = formatDate(post.createdAt);

  const isOwner = currentUser && post.authorId && currentUser.userId === post.authorId;
  const isAdmin = currentUser && currentUser.role === 'admin';
  const canEdit = isOwner || isAdmin;

  const authorRole = post.authorId === 'u_admin_001' ? 'admin' : 'user';

  return (
    <div className="group relative flex flex-col rounded-lg border border-gray-200 bg-white shadow-card transition-shadow hover:shadow-card-hover dark:border-gray-700 dark:bg-gray-800 border-l-4 border-l-writespace-500">
      <Link
        to={`/blog/${post.id}`}
        className="flex flex-1 flex-col p-5"
      >
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-writespace-600 dark:text-white dark:group-hover:text-writespace-400">
          {post.title}
        </h3>

        <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3 dark:text-gray-400">
          {excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar role={authorRole} size="sm" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {post.authorName}
            </span>
          </div>

          {formattedDate && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {formattedDate}
            </span>
          )}
        </div>
      </Link>

      {canEdit && (
        <Link
          to={`/blog/${post.id}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 opacity-0 transition-opacity hover:bg-writespace-100 hover:text-writespace-600 group-hover:opacity-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-writespace-900/30 dark:hover:text-writespace-400"
          aria-label={`Edit ${post.title}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
          </svg>
        </Link>
      )}
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    authorId: PropTypes.string,
    authorName: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string,
    username: PropTypes.string,
    displayName: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
  }),
};

BlogCard.defaultProps = {
  currentUser: null,
};

export default BlogCard;