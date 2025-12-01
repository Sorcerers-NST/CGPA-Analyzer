/**
 * Navbar - cal.com style
 * 
 * Global sticky navigation with:
 * - Logo/brand on left
 * - Breadcrumbs/page title in center
 * - Command trigger, user menu on right
 * 
 * Height: 64px, minimal, clean
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCommand, FiUser, FiSettings, FiLogOut, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = ({ onCommandOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/analytics') return 'Analytics';
    if (path === '/predictor') return 'Predictor';
    if (path === '/settings') return 'Settings';
    if (path === '/profile') return 'Profile';
    if (path.startsWith('/semester/')) return 'Semester Details';
    return '';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // User initials for avatar
  const getUserInitials = () => {
    if (!user?.username) return 'U';
    return user.username.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-navy-800 border-b border-gray-100 dark:border-navy-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white dark:bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors border-2 border-gray-200 dark:border-white">
                <span className="text-black dark:text-black font-bold text-sm">CA</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white tracking-tight">CGPA Analyzer</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/dashboard" label="Dashboard" />
              <NavLink to="/analytics" label="Analytics" />
              <NavLink to="/predictor" label="Predictor" />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600 transition-colors"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="w-4 h-4" />
              ) : (
                <FiMoon className="w-4 h-4" />
              )}
            </button>

            {/* Command Palette Trigger */}
            <button
              onClick={onCommandOpen}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
              title="Open command palette (Cmd+K)"
            >
              <FiCommand className="w-4 h-4" />
              K
            </button>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-white dark:bg-white text-black dark:text-black rounded-lg flex items-center justify-center text-xs font-medium border-2 border-gray-200 dark:border-white">
                  {getUserInitials()}
                </div>
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-navy-800 rounded-xl shadow-xl border border-gray-100 dark:border-navy-700 overflow-hidden transition-colors duration-200"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-navy-700">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{user?.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <MenuLink
                        icon={<FiUser className="w-4 h-4" />}
                        label="Profile"
                        onClick={() => {
                          navigate('/profile');
                          setUserMenuOpen(false);
                        }}
                      />
                      <MenuLink
                        icon={<FiSettings className="w-4 h-4" />}
                        label="Settings"
                        onClick={() => {
                          navigate('/settings');
                          setUserMenuOpen(false);
                        }}
                      />
                    </div>
                    <div className="py-2 border-t border-gray-100 dark:border-navy-700">
                      <MenuLink
                        icon={<FiLogOut className="w-4 h-4" />}
                        label="Log out"
                        onClick={handleLogout}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 dark:border-navy-700 bg-white dark:bg-navy-800 transition-colors duration-200"
          >
            <div className="px-4 py-4 space-y-2">
              <MobileNavLink to="/dashboard" label="Dashboard" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/analytics" label="Analytics" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/predictor" label="Predictor" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/settings" label="Settings" onClick={() => setMobileMenuOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Nav Link Component
const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        px-3 py-2 text-sm font-medium rounded-lg transition-colors
        ${isActive 
          ? 'bg-gray-100 dark:bg-navy-700 text-gray-900 dark:text-white' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 hover:text-gray-900 dark:hover:text-white'
        }
      `}
    >
      {label}
    </Link>
  );
};

// Mobile Nav Link
const MobileNavLink = ({ to, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        block px-3 py-2 text-sm font-medium rounded-lg transition-colors
        ${isActive 
          ? 'bg-gray-100 dark:bg-navy-700 text-gray-900 dark:text-white' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 hover:text-gray-900 dark:hover:text-white'
        }
      `}
    >
      {label}
    </Link>
  );
};

// Menu Link Component
const MenuLink = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Navbar;
