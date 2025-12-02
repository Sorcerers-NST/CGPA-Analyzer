import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiBook, FiCalendar, FiFileText } from 'react-icons/fi';
import axios from '../../config/axios';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: '',
    university: '',
    graduationYear: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.username.trim()) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    if (!formData.university.trim()) {
      setError('University/College name is required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put('/api/users/complete-profile', formData);

      // Update user context
      updateUser({ ...user, ...response.data.user, profileCompleted: true });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-navy-900 dark:via-navy-900 dark:to-navy-800 flex items-center justify-center px-4 py-8 transition-colors duration-200">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-navy-700 p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-white rounded-2xl mb-4 border-2 border-gray-200 dark:border-white">
              <FiUser className="w-8 h-8 text-black dark:text-black" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Help us personalize your experience by completing your profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <FiUser className="w-4 h-4" />
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-navy-900 border border-gray-300 dark:border-navy-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent focus:bg-white dark:focus:bg-navy-900 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="university" className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <FiBook className="w-4 h-4" />
                University / College <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                id="university"
                name="university"
                type="text"
                value={formData.university}
                onChange={handleChange}
                placeholder="Enter your university or college name"
                required
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-navy-900 border border-gray-300 dark:border-navy-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent focus:bg-white dark:focus:bg-navy-900 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="graduationYear" className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <FiCalendar className="w-4 h-4" />
                Expected Graduation Year
              </label>
              <input
                id="graduationYear"
                name="graduationYear"
                type="text"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g., 2025"
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-navy-900 border border-gray-300 dark:border-navy-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent focus:bg-white dark:focus:bg-navy-900 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <FiFileText className="w-4 h-4" />
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us a little about yourself..."
                rows="4"
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-navy-900 border border-gray-300 dark:border-navy-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent focus:bg-white dark:focus:bg-navy-900 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white dark:bg-white text-black dark:text-black py-3.5 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Saving...' : 'Complete Profile & Continue'}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Fields marked with <span className="text-red-500 dark:text-red-400">*</span> are required
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
