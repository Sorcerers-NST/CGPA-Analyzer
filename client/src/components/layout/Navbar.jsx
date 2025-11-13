import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ onCommandOpen }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
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
    if (path === '/settings') return 'Settings';
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
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="hidden sm:block text-base font-semibold text-black tracking-tight">CGPA Analyzer</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/dashboard" label="Dashboard" />
              <NavLink to="/analytics" label="Analytics" />
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center space-x-3">
            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 bg-black text-white rounded-md flex items-center justify-center text-xs font-semibold">
                  {getUserInitials()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-black">{user?.username}</span>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-black">{user?.username}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <MenuLink
                        label="Profile"
                        onClick={() => {
                          navigate('/complete-profile');
                          setUserMenuOpen(false);
                        }}
                      />
                      <MenuLink
                        label="Settings"
                        onClick={() => {
                          navigate('/settings');
                          setUserMenuOpen(false);
                        }}
                      />
                    </div>
                    <div className="py-1 border-t border-gray-100">
                      <MenuLink
                        label="Sign out"
                        onClick={handleLogout}
                        danger
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
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
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              <MobileNavLink to="/dashboard" label="Dashboard" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/analytics" label="Analytics" onClick={() => setMobileMenuOpen(false)} />
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
      className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
        isActive 
          ? 'bg-gray-100 text-black' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-black'
      }`}
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
      className={`block px-3 py-2 text-sm font-medium rounded-md transition-all ${
        isActive 
          ? 'bg-gray-100 text-black' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-black'
      }`}
    >
      {label}
    </Link>
  );
};

// Menu Link Component
const MenuLink = ({ label, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
      danger 
        ? 'text-red-600 hover:bg-red-50' 
        : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

export default Navbar;
