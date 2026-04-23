import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCurrentUser, logout } from '../utils/auth.js';
import { Avatar } from './Avatar.jsx';

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        active
          ? 'bg-writespace-100 text-writespace-700 dark:bg-writespace-900/30 dark:text-writespace-300'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
};

NavLink.defaultProps = {
  active: false,
};

function MobileNavLink({ to, children, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        active
          ? 'bg-writespace-100 text-writespace-700 dark:bg-writespace-900/30 dark:text-writespace-300'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

MobileNavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

MobileNavLink.defaultProps = {
  active: false,
  onClick: undefined,
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const isAdmin = currentUser && currentUser.role === 'admin';

  function handleLogout() {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-700 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-writespace-600 transition-colors hover:text-writespace-700 dark:text-writespace-400 dark:hover:text-writespace-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
              </svg>
              WriteSpace
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden items-center gap-1 md:flex">
              <NavLink to="/blogs" active={isActive('/blogs')}>
                Blogs
              </NavLink>
              <NavLink to="/write" active={isActive('/write')}>
                Write
              </NavLink>
              {isAdmin && (
                <>
                  <NavLink to="/dashboard" active={isActive('/dashboard')}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/users" active={isActive('/users')}>
                    Users
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Desktop User Section */}
          <div className="hidden items-center gap-4 md:flex">
            {currentUser && (
              <div className="flex items-center gap-3">
                <Avatar role={currentUser.role || 'user'} size="sm" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentUser.displayName}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-900/30 dark:hover:text-red-400 dark:focus:ring-offset-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mr-1.5 h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-writespace-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:hidden">
          <div className="space-y-1 px-4 py-3">
            <MobileNavLink to="/blogs" active={isActive('/blogs')} onClick={closeMobileMenu}>
              Blogs
            </MobileNavLink>
            <MobileNavLink to="/write" active={isActive('/write')} onClick={closeMobileMenu}>
              Write
            </MobileNavLink>
            {isAdmin && (
              <>
                <MobileNavLink to="/dashboard" active={isActive('/dashboard')} onClick={closeMobileMenu}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/users" active={isActive('/users')} onClick={closeMobileMenu}>
                  Users
                </MobileNavLink>
              </>
            )}
          </div>

          <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
            {currentUser && (
              <div className="mb-3 flex items-center gap-3">
                <Avatar role={currentUser.role || 'user'} size="sm" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentUser.displayName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    @{currentUser.username}
                  </span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mr-2 h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;