import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';
import { BlogCard } from '../components/BlogCard.jsx';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    const allPosts = getPosts();
    const sorted = [...allPosts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    setPosts(sorted);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Blog Posts
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {posts.length > 0
                ? `${posts.length} post${posts.length === 1 ? '' : 's'} published`
                : 'No posts yet'}
            </p>
          </div>
          {currentUser && (
            <Link
              to="/blog/new"
              className="inline-flex items-center gap-2 rounded-lg bg-writespace-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-writespace-700 focus:outline-none focus:ring-2 focus:ring-writespace-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              New Post
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-800">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-writespace-50 dark:bg-writespace-900/20">
              <span className="text-3xl">✍️</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              No posts yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first blog post. Share your thoughts with the world!
            </p>
            {currentUser && (
              <Link
                to="/blog/new"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-writespace-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-writespace-700 focus:outline-none focus:ring-2 focus:ring-writespace-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} currentUser={currentUser} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}