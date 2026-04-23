import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/StatCard.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getPosts, getUsers } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';

export function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const session = getCurrentUser();
    setCurrentUser(session);

    const allPosts = getPosts();
    setPosts(allPosts);

    const allUsers = getUsers();
    setUsers(allUsers);
  }, []);

  const totalPosts = posts.length;
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role !== 'admin').length;

  const recentPosts = [...posts]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back, {currentUser?.displayName || 'Administrator'}. Here's an overview of your platform.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Posts"
            value={totalPosts}
            icon="📝"
            color="blue"
          />
          <StatCard
            label="Total Users"
            value={totalUsers}
            icon="👥"
            color="green"
          />
          <StatCard
            label="Admins"
            value={adminCount}
            icon="👑"
            color="purple"
          />
          <StatCard
            label="Regular Users"
            value={userCount}
            icon="📖"
            color="indigo"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/blog/new"
              className="inline-flex items-center gap-2 rounded-lg bg-writespace-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-writespace-700 focus:outline-none focus:ring-2 focus:ring-writespace-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
              </svg>
              Write Post
            </Link>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-writespace-400 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
              </svg>
              Manage Users
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Posts
            </h2>
            {totalPosts > 5 && (
              <Link
                to="/"
                className="text-sm font-medium text-writespace-600 hover:text-writespace-700 dark:text-writespace-400 dark:hover:text-writespace-300"
              >
                View all →
              </Link>
            )}
          </div>

          {recentPosts.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">
                No posts yet. Create your first post to get started.
              </p>
              <Link
                to="/blog/new"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-writespace-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-writespace-700"
              >
                Write your first post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;