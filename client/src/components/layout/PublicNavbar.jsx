import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';
import Button from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';

const PublicNavbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-navy-800/80 backdrop-blur-md border-b border-gray-100 dark:border-navy-700 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white dark:bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors border-2 border-gray-200 dark:border-white">
              <span className="text-black dark:text-black font-bold text-sm">CA</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white tracking-tight">CGPA Analyzer</span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
