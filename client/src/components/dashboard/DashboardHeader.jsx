import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';

/**
 * DashboardHeader Component
 * Minimalist sticky navbar with user dropdown and theme toggle
 * Inspired by Cal.com design
 */
const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.username) return 'U';
    return user.username.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-black dark:text-white tracking-tight transition-colors duration-200">
              CGPA Analyzer
            </h1>
          </div>

          {/* Right Side: Theme Toggle + User Menu */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 focus:outline-none group"
            >
              {/* User Avatar */}
              <div className="w-9 h-9 rounded-full bg-white dark:bg-white text-black flex items-center justify-center font-medium text-sm transition-transform group-hover:scale-105 border-2 border-gray-200 dark:border-white">
                {getUserInitials()}
              </div>
              
              {/* Username (hidden on mobile) */}
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                {user?.username || 'User'}
              </span>

              {/* Dropdown Arrow */}
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-navy-800 rounded-lg shadow-lg border border-gray-200 dark:border-navy-700 py-1"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-navy-700">
                    <p className="text-sm font-medium text-black dark:text-white">
                      {user?.username || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Navigate to profile
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Navigate to settings
                      }}
                    >
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 dark:border-navy-700 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-navy-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
