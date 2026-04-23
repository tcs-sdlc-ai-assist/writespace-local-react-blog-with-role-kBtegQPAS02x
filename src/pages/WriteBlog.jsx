import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPosts, addPost, updatePost } from '../utils/storage.js';
import { getCurrentUser, isAuthenticated } from '../utils/auth.js';

export function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!isAuthenticated() || !currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    if (isEditMode) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        setError('Post not found');
        setInitialLoading(false);
        return;
      }

      const isOwner = currentUser.userId === post.authorId;
      const isAdmin = currentUser.role === 'admin';

      if (!isOwner && !isAdmin) {
        setError('You do not have permission to edit this post');
        setInitialLoading(false);
        return;
      }

      setTitle(post.title);
      setContent(post.content);
    }

    setInitialLoading(false);
  }, [id, isEditMode, navigate, currentUser]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!title || title.trim().length < 3) {
        setError('Title must be at least 3 characters');
        setLoading(false);
        return;
      }

      if (!content || content.trim().length < 10) {
        setError('Content must be at least 10 characters');
        setLoading(false);
        return;
      }

      if (isEditMode) {
        const result = updatePost(id, {
          title: title.trim(),
          content: content.trim(),
        });

        if (!result.success) {
          setError(result.error || 'Failed to update post');
          setLoading(false);
          return;
        }

        navigate(`/blog/${id}`, { replace: true });
      } else {
        const result = addPost({
          title: title.trim(),
          content: content.trim(),
          authorId: currentUser.userId,
          authorName: currentUser.displayName,
        });

        if (!result.success) {
          setError(result.error || 'Failed to create post');
          setLoading(false);
          return;
        }

        navigate(`/blog/${result.post.id}`, { replace: true });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse-soft">Loading…</p>
      </div>
    );
  }

  if (error && (error === 'Post not found' || error === 'You do not have permission to edit this post')) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-8 text-center shadow-card dark:border-red-800 dark:bg-gray-800">
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">{error}</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-md bg-writespace-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-writespace-700 focus:outline-none focus:ring-2 focus:ring-writespace-400 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Post' : 'Write New Post'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditMode
              ? 'Update your blog post below.'
              : 'Create a new blog post by filling out the form below.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title…"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-writespace-500 focus:outline-none focus:ring-2 focus:ring-writespace-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-writespace-500"
            />
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Minimum 3 characters
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {title.length} character{title.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here…"
              rows={14}
              className="mt-1 block w-full resize-y rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-writespace-500 focus:outline-none focus:ring-2 focus:ring-writespace-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-writespace-500"
            />
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Minimum 10 characters
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {content.length} character{content.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-writespace-400 focus:ring-offset-1 dark:focus:ring-offset-gray-900 ${
                loading
                  ? 'cursor-not-allowed bg-writespace-400'
                  : 'bg-writespace-600 hover:bg-writespace-700'
              }`}
            >
              {loading
                ? isEditMode
                  ? 'Updating…'
                  : 'Publishing…'
                : isEditMode
                  ? 'Update Post'
                  : 'Publish Post'}
            </button>

            <Link
              to={isEditMode ? `/blog/${id}` : '/'}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-writespace-400 focus:ring-offset-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WriteBlog;