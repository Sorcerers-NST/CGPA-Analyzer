/**
 * HomeFooter - cal.com style
 * 
 * Minimal SaaS footer with links and copyright
 * Clean, single line, no clutter
 */

import { Link } from 'react-router-dom';

const HomeFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Links */}
          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {currentYear} CGPA Analyzer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
