import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  function toggleMobileMenu() {
    setMobileMenuOpen((prev) => !prev);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function isActive(path) {
    return location.pathname === path;
  }

  const linkBase =
    'rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-writespace-400 focus:ring-offset-1';
  const linkInactive =
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white';
  const linkActiveClass =
    'bg-writespace-50 text-writespace-700 dark:bg-writespace-900/30 dark:text-writespace-300';

  const mobileLinkBase =
    'block rounded-md px-3 py-2 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-writespace-400';
  const mobileLinkInactive =
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white';
  const mobileLinkActive =
    'bg-writespace-50 text-writespace-700 dark:bg-writespace-900/30 dark:text-writespace-300';

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-writespace-600 transition-colors hover:text-writespace-700 dark:text-writespace-400 dark:hover:text-writespace-300"
              onClick={closeMobileMenu}
            >
              <span className="text-2xl" role="img" aria-label="WriteSpace logo">
                ✍️
              </span>
              <span>WriteSpace</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              to="/login"
              className={`${linkBase} ${isActive('/login') ? linkActiveClass : linkInactive}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center rounded-md bg-writespace-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-writespace-700 focus:outline-none focus:ring-2 focus:ring-writespace-400 focus:ring-offset-1 dark:bg-writespace-500 dark:hover:bg-writespace-600"
            >
              Register
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-writespace-400 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sm:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            <Link
              to="/login"
              className={`${mobileLinkBase} ${isActive('/login') ? mobileLinkActive : mobileLinkInactive}`}
              onClick={closeMobileMenu}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`${mobileLinkBase} ${isActive('/register') ? mobileLinkActive : mobileLinkInactive}`}
              onClick={closeMobileMenu}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default PublicNavbar;