import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllSemesters, createSemester, calculateSemesterCGPA } from '../../services/semesterApi';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState([]);
  const [stats, setStats] = useState({
    cgpa: null,
    totalSemesters: 0,
    totalCredits: 0,
    completedCourses: 0
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSemesterNumber, setNewSemesterNumber] = useState('');
  const [creatingSemester, setCreatingSemester] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      fetchSemesters();
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchSemesters = async () => {
    try {
      const response = await getAllSemesters();
      const semestersData = response.data || [];
      setSemesters(semestersData);

      // Calculate overall statistics
      let totalCredits = 0;
      let totalCourses = 0;
      let totalWeightedGPA = 0;

      for (const semester of semestersData) {
        if (semester.subjects) {
          totalCourses += semester.subjects.length;

          // Calculate credits and weighted GPA
          semester.subjects.forEach((subject) => {
            if (subject.gradePoint !== null && subject.gradePoint !== undefined) {
              totalCredits += subject.credits;
              totalWeightedGPA += subject.gradePoint * subject.credits;
            }
          });
        }
      }

      const overallCGPA = totalCredits > 0 ? totalWeightedGPA / totalCredits : null;

      setStats({
        cgpa: overallCGPA,
        totalSemesters: semestersData.length,
        totalCredits: totalCredits,
        completedCourses: totalCourses,
      });
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleAddSemester = () => {
    setShowAddModal(true);
  };

  const handleCreateSemester = async (e) => {
    e.preventDefault();
    
    if (!newSemesterNumber) {
      alert('Please enter a semester number');
      return;
    }

    try {
      setCreatingSemester(true);
      console.log('Creating semester with number:', newSemesterNumber);
      
      const response = await createSemester({ semesterNumber: parseInt(newSemesterNumber) });
      console.log('Semester created successfully:', response);
      
      setShowAddModal(false);
      setNewSemesterNumber('');
      await fetchSemesters(); // Refresh the list
    } catch (error) {
      console.error('Error creating semester:', error);
      alert(error.message || 'Failed to create semester. Please check the console for details.');
    } finally {
      setCreatingSemester(false);
    }
  };

  const handleSemesterClick = (semesterId) => {
    navigate(`/semester/${semesterId}`);
  };

  const handleViewReports = () => {
    alert('Reports feature - coming soon!');
  };

  const handleExportData = () => {
    alert('Export data feature - coming soon!');
  };

  if (loading || authLoading) {
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
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-gray-900">CGPA Calculator</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-6">
              <span className="hidden sm:inline text-sm font-medium text-gray-900">{user?.username}</span>
              <button onClick={handleLogout} className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {user?.college?.name === 'Default College' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-yellow-900 mb-1">Complete Your Profile</h3>
                <p className="text-xs sm:text-sm text-yellow-800 mb-3">Select your college to get accurate CGPA calculations.</p>
                <button onClick={() => navigate('/complete-profile')} className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-all">
                  Select College
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
          <p className="text-gray-300 text-sm sm:text-base">Track your academic progress and manage your semesters</p>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-sm font-medium truncate">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">College</p>
                <p className="text-sm font-medium truncate">{user?.college?.name || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Current CGPA</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.cgpa ? stats.cgpa.toFixed(2) : '--'}</p>
            <p className="text-xs text-gray-500 mt-2">{stats.cgpa ? 'Overall performance' : 'Add semesters to calculate'}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Semesters</p>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSemesters}</p>
            <p className="text-xs text-gray-500 mt-2">Academic periods tracked</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCredits}</p>
            <p className="text-xs text-gray-500 mt-2">Credit hours earned</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Courses</p>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.completedCourses}</p>
            <p className="text-xs text-gray-500 mt-2">Courses completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <button onClick={handleAddSemester} className="bg-white rounded-xl shadow p-6 border-2 border-gray-200 hover:border-gray-900 hover:shadow-lg transition-all text-left group">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Semester</h3>
            <p className="text-sm text-gray-600">Start tracking a new semester with courses and grades</p>
          </button>

          <button onClick={handleViewReports} className="bg-white rounded-xl shadow p-6 border-2 border-gray-200 hover:border-gray-900 hover:shadow-lg transition-all text-left group">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Reports</h3>
            <p className="text-sm text-gray-600">Analyze your academic progress with detailed insights</p>
          </button>

          <button onClick={handleExportData} className="bg-white rounded-xl shadow p-6 border-2 border-gray-200 hover:border-gray-900 hover:shadow-lg transition-all text-left group">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Data</h3>
            <p className="text-sm text-gray-600">Download your academic records as PDF or CSV</p>
          </button>
        </div>

        {semesters.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No semesters yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Start by adding your first semester to track your academic performance and calculate your CGPA.</p>
            <button onClick={handleAddSemester} className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Semester
            </button>
          </div>
        )}

        {semesters.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Your Semesters</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {semesters.map((semester) => (
                <div
                  key={semester.id}
                  onClick={() => handleSemesterClick(semester.id)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Semester {semester.semesterNumber}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {semester.subjects?.length || 0} subjects
                        </span>
                        {semester.startDate && (
                          <span>{new Date(semester.startDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">SGPA</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {semester.sgpa?.toFixed(2) || '--'}
                        </p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Semester Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Semester</h2>
            <form onSubmit={handleCreateSemester}>
              <div className="mb-4">
                <label htmlFor="semesterNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Semester Number
                </label>
                <input
                  type="number"
                  id="semesterNumber"
                  value={newSemesterNumber}
                  onChange={(e) => setNewSemesterNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., 1, 2, 3..."
                  min="1"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSemesterNumber('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                  disabled={creatingSemester}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  disabled={creatingSemester}
                >
                  {creatingSemester ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
