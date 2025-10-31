import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from server
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/me', { 
          credentials: 'include' 
        });
        
        if (!res.ok) {
          // Not authenticated, redirect to login
          navigate('/login');
          return;
        }
        
        const data = await res.json();
        setUser(data);

        // If user has default college, prompt them to complete profile
        if (data.college?.name === 'Default College') {
          // Show a banner or redirect to complete profile
          console.log('User needs to complete profile');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include' 
      });
    } catch (err) {
      console.error('Logout error', err);
    }
    
    // Redirect to landing page
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900">
                CGPA Calculator
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-6">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{user?.username || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                Logout
              </button>
            </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="space-y-6 sm:space-y-8">
          {/* Profile Completion Banner */}
          {user?.college?.name === 'Default College' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-yellow-900 mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="text-xs sm:text-sm text-yellow-800 mb-3">
                    You signed up with Google. Please select your college to get the most accurate CGPA calculations.
                  </p>
                  <button
                    onClick={() => navigate('/complete-profile')}
                    className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-all"
                  >
                    Select College
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome to Your Dashboard! 🎉
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Start tracking your academic performance and manage your semesters.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 break-all">
                <span className="font-medium">Email:</span> {user?.email || 'N/A'}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">College:</span> {user?.college?.name || 'Not set'}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Current CGPA</p>
                  <p className="text-3xl font-bold text-gray-900">--</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Add semesters to calculate</p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Semesters</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Start adding your data</p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Credits</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Across all semesters</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Add New Semester</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                Start tracking your grades by adding your first semester data.
              </p>
              <button className="w-full sm:w-auto px-6 py-3 bg-white text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all">
                Add Semester
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">View Reports</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Access detailed analytics and export your academic performance.
              </p>
              <button className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
