import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllSemesters, createSemester } from '../../services/semesterApi';
import { useAuth } from '../../contexts/AuthContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import CGPACard from '../../components/dashboard/CGPACard';
import SemesterCard from '../../components/dashboard/SemesterCard';
// import QuickStats from '../../components/dashboard/QuickStats';
// import GradeDistribution from '../../components/dashboard/GradeDistribution';
// import GradeCalculator from '../../components/dashboard/GradeCalculator';
// import RecentActivity from '../../components/dashboard/RecentActivity';
// import ExportData from '../../components/dashboard/ExportData';
// import SearchFilter from '../../components/dashboard/SearchFilter';
// import SemesterComparison from '../../components/dashboard/SemesterComparison';
// import GoalTracker from '../../components/dashboard/GoalTracker';
// import PerformanceAnalytics from '../../components/dashboard/PerformanceAnalytics';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState([]);
  const [stats, setStats] = useState({
    cgpa: null,
    totalSemesters: 0,
    totalCredits: 0,
    completedCourses: 0,
  });
  const [quote, setQuote] = useState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSemesterNumber, setNewSemesterNumber] = useState('');
  const [creatingSemester, setCreatingSemester] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      fetchSemesters();
    }
  }, [user, authLoading]);

  const fetchSemesters = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error", err);
    }
    navigate("/");
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
      const response = await createSemester({ semesterNumber: parseInt(newSemesterNumber) });
      
      setShowAddModal(false);
      setNewSemesterNumber('');
      await fetchSemesters(); // Refresh the list
    } catch (error) {
      console.error('Error creating semester:', error);
      alert(error.message || 'Failed to create semester.');
    } finally {
      setCreatingSemester(false);
    }
  };

  // Prepare semester data for CGPA card
  const prepareChartData = () => {
    return semesters.map((sem) => {
      let semesterCGPA = 0;
      let totalCredits = 0;
      let weightedSum = 0;

      if (sem.subjects && sem.subjects.length > 0) {
        sem.subjects.forEach((subject) => {
          if (subject.gradePoint !== null && subject.gradePoint !== undefined) {
            totalCredits += subject.credits;
            weightedSum += subject.gradePoint * subject.credits;
          }
        });
        
        if (totalCredits > 0) {
          semesterCGPA = weightedSum / totalCredits;
        }
      }

      return {
        ...sem,
        cgpa: semesterCGPA,
        credits: totalCredits,
      };
    });
  const handleViewReports = () => {
    alert("Reports feature - coming soon!");
  };

  const handleExportData = () => {
    alert("Export data feature - coming soon!");
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Warning - if college not set */}
        {user?.college?.name === 'Default College' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-black mb-1">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Select your college to get accurate CGPA calculations.
                </p>
                <button
                  onClick={() => navigate('/complete-profile')}
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Select College
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-black mb-2">
            Welcome back, {user?.username} 👋
          </h1>
          <p className="text-gray-600">Here's your academic overview.</p>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-12"></div>

        {/* CGPA Summary Card */}
        <div className="mb-12">
          <CGPACard
            cgpa={stats.cgpa}
            lastUpdated={new Date().toISOString()}
            semesterData={chartData}
          />
        </div>
        <div>
          {quote ? (
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      d="M.036 3A3.504 3.504 0 0 1 4 .036v2.049A1.506 1.506 0 0 0 2.085 3H6v6H0V3h.036zm15.928 7H16v6h-6v-6h3.915A1.496 1.496 0 0 0 12 9.086v-2.05A3.504 3.504 0 0 1 15.964 10zM14 12h-2v2h2v-2zM2 5v2h2V5H2z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Quote of the Day
                  </p>

                  <blockquote className="mt-2 text-gray-900 italic text-base sm:text-lg leading-relaxed">
                    “{quote.quote}”
                  </blockquote>

        {/* Analytics Grid - Quick Stats, Distribution, Activity */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <QuickStats stats={stats} />
          <GradeDistribution semesters={semesters} />
          <RecentActivity semesters={semesters} />
        </div> */}

        {/* Grade Calculator */}
        {/* <div className="mb-12">
          <GradeCalculator 
            currentCGPA={stats.cgpa} 
            totalCredits={stats.totalCredits} 
          />
        </div> */}

        {/* Search & Goal Tracker Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <SearchFilter semesters={semesters} />
          <GoalTracker currentCGPA={stats.cgpa} semesters={semesters} />
        </div> */}

        {/* Semester Comparison */}
        {/* {semesters.length > 0 && (
          <div className="mb-12">
            <SemesterComparison semesters={semesters} />
          </div>
        )} */}

        {/* Performance Analytics */}
        {/* {semesters.length > 0 && (
          <div className="mb-12">
            <PerformanceAnalytics semesters={semesters} />
          </div>
        )} */}

        {/* Semester Overview Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-black">Your Semesters</h2>
            <div className="flex items-center gap-3">
              {/* {semesters.length > 0 && (
                <ExportData 
                  semesters={semesters} 
                  cgpa={stats.cgpa} 
                  user={user} 
                />
              )} */}
              <button
                onClick={handleAddSemester}
                className="flex items-center space-x-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add Semester</span>
              </button>
            </div>
          </div>

          {/* Empty State */}
          {semesters.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                No semesters yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start by adding your first semester to track your academic performance
                and calculate your CGPA.
              </p>
              <button
                onClick={handleAddSemester}
                className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add Your First Semester</span>
              </button>
            </motion.div>
          )}

          {/* Semester Grid */}
          {semesters.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {semesters.map((semester, index) => (
                <SemesterCard
                  key={semester.id}
                  semester={semester}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2025 CGPA Analyzer. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Add Semester Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-black mb-6">Add New Semester</h2>
            <form onSubmit={handleCreateSemester}>
              <div className="mb-6">
                <label
                  htmlFor="semesterNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Semester Number
                </label>
                <input
                  type="number"
                  id="semesterNumber"
                  value={newSemesterNumber}
                  onChange={(e) => setNewSemesterNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black"
                  placeholder="e.g., 1, 2, 3..."
                  min="1"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSemesterNumber('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={creatingSemester}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  disabled={creatingSemester}
                >
                  {creatingSemester ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
