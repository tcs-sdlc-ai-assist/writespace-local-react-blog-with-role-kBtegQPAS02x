import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { isAuthenticated } from './utils/auth.js';
import { Navbar } from './components/Navbar.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Home from './pages/Home.jsx';
import { WriteBlog } from './pages/WriteBlog.jsx';
import { ReadBlog } from './pages/ReadBlog.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { UserManagement } from './pages/UserManagement.jsx';

function AuthenticatedLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes (any authenticated user) */}
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Home />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/write"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <WriteBlog />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/new"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <WriteBlog />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:id/edit"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <WriteBlog />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ReadBlog />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <WriteBlog />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AuthenticatedLayout>
                <AdminDashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AuthenticatedLayout>
                <AdminDashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <AuthenticatedLayout>
                <UserManagement />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AuthenticatedLayout>
                <UserManagement />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
              <h1 className="text-6xl font-bold text-writespace-600 dark:text-writespace-400">
                404
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Page not found
              </p>
              <a
                href="/"
                className="mt-6 inline-flex items-center rounded-lg bg-writespace-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-writespace-700 focus:outline-none focus:ring-2 focus:ring-writespace-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                ← Back to Home
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}