import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPosts, removePost } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';
import { Avatar } from '../components/Avatar.jsx';

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    try {
      const posts = getPosts();
      const found = posts.find((p) => p.id === id);
      if (found) {
        setPost(found);
      } else {
        setError('Post not found');
      }
    } catch {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  function handleDelete() {
    if (!post) return;

    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmed) return;

    const result = removePost(post.id);
    if (result.success) {
      navigate('/blogs');
    } else {
      setError(result.error || 'Failed to delete post');
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
        <p className="text-lg text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 px-4 dark:bg-surface-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {error || 'Post not found'}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          The post you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/blogs"
          className="mt-6 inline-flex items-center rounded-lg bg-writespace-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-writespace-700 focus:outline-none focus:ring-2 focus:ring-writespace-400 focus:ring-offset-2 dark:focus:ring-offset-surface-900"
        >
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && post.authorId && currentUser.userId === post.authorId;
  const isAdmin = currentUser && currentUser.role === 'admin';
  const canEdit = isOwner || isAdmin;
  const authorRole = post.authorId === 'u_admin_001' ? 'admin' : 'user';
  const formattedDate = formatDate(post.createdAt);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center text-sm font-medium text-writespace-600 transition-colors hover:text-writespace-700 dark:text-writespace-400 dark:hover:text-writespace-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="mr-1 h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to Blogs
          </Link>
        </div>

        <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-card dark:border-gray-700 dark:bg-gray-800 sm:p-10">
          <header className="mb-8 border-b border-gray-200 pb-8 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar role={authorRole} size="md" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {post.authorName}
                  </span>
                  {formattedDate && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formattedDate}
                    </span>
                  )}
                </div>
              </div>

              {canEdit && (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/blog/${post.id}/edit`}
                    className="inline-flex items-center rounded-md bg-writespace-50 px-3 py-1.5 text-xs font-medium text-writespace-600 transition-colors hover:bg-writespace-100 focus:outline-none focus:ring-2 focus:ring-writespace-400 focus:ring-offset-1 dark:bg-writespace-900/20 dark:text-writespace-400 dark:hover:bg-writespace-900/40 dark:focus:ring-offset-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="mr-1 h-3.5 w-3.5"
                    >
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 dark:focus:ring-offset-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="mr-1 h-3.5 w-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

export default ReadBlog;