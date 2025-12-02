import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NotFound = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center px-4">
                <h1 className="text-9xl font-bold text-indigo-600 dark:text-indigo-400">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to={isAuthenticated ? "/dashboard" : "/"}
                    className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    {isAuthenticated ? "Go to Dashboard" : "Go to Home"}
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
