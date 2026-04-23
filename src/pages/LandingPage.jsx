import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage.js';
import { isAuthenticated, getCurrentUser } from '../utils/auth.js';
import { PublicNavbar } from '../components/PublicNavbar.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { BlogCard } from '../components/BlogCard.jsx';

export default function LandingPage() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setAuthed(authenticated);

    if (authenticated) {
      const user = getCurrentUser();
      setCurrentUser(user);
    }

    const allPosts = getPosts();
    const sorted = [...allPosts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    setPosts(sorted.slice(0, 3));
  }, []);

  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {authed ? <Navbar /> : <PublicNavbar />}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero px-4 py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-content text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Welcome to{' '}
            <span className="text-white/90">WriteSpace</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
            A distraction-free writing platform for sharing your ideas with the world.
            Create, publish, and manage your blog posts with ease.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {authed ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-writespace-600 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-writespace-600"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/blogs"
                    className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-writespace-600 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-writespace-600"
                  >
                    View Blogs
                  </Link>
                )}
                <Link
                  to="/blog/new"
                  className="inline-flex items-center rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-writespace-600"
                >
                  Write a Post
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-writespace-600 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-writespace-600"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-writespace-600"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-800 sm:py-24">
        <div className="mx-auto max-w-content">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Why WriteSpace?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
              Everything you need to write, publish, and share your stories.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-writespace-50 dark:bg-writespace-900/20">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Distraction-Free Writing
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                A clean, minimal editor that lets you focus on what matters most — your words. No clutter, no distractions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                <span className="text-2xl">💾</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Auto-Save Locally
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Your work is automatically saved to your browser. No accounts required to start writing — your data stays with you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Publish Instantly
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Create an account and publish your posts in seconds. Share your ideas with the community effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="px-4 py-16 dark:bg-gray-900 sm:py-24">
        <div className="mx-auto max-w-content">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Latest Posts
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
              Discover the most recent stories from our community.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-writespace-50 dark:bg-writespace-900/20">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No posts yet
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Be the first to share your thoughts. Create an account and start writing today!
              </p>
              {!authed && (
                <Link
                  to="/register"
                  className="mt-6 inline-flex items-center rounded-lg bg-writespace-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-writespace-700 focus:outline-none focus:ring-2 focus:ring-writespace-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Create Account
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} currentUser={currentUser} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  to="/blogs"
                  className="inline-flex items-center text-sm font-medium text-writespace-600 transition-colors hover:text-writespace-700 dark:text-writespace-400 dark:hover:text-writespace-300"
                >
                  View all posts →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-12 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-content">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="WriteSpace logo">
                ✍️
              </span>
              <span className="text-lg font-bold text-writespace-600 dark:text-writespace-400">
                WriteSpace
              </span>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/blogs"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Blogs
              </Link>
              {!authed && (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Register
                  </Link>
                </>
              )}
              {authed && (
                <Link
                  to="/blog/new"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Write
                </Link>
              )}
            </nav>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8 text-center dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}