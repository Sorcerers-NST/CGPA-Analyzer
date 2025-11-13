import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllSemesters, createSemester } from '../../services/semesterApi';
import { useAuth } from '../../contexts/AuthContext';
import CGPACard from '../../components/dashboard/CGPACard';
import SemesterCard from '../../components/dashboard/SemesterCard';

/**
 * Dashboard Component
 * Production-grade Cal.com-inspired SaaS dashboard
 * Pure black & white minimalism with premium animations
 */
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
    averageSGPA: 0,
    highestSGPA: 0,
    lowestSGPA: 0,
    topPerformingSemester: null,
    recentActivity: [],
  });
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

      // Calculate comprehensive statistics
      let totalCredits = 0;
      let totalCourses = 0;
      let totalWeightedGPA = 0;
      let semesterSGPAs = [];
      let topSemester = null;
      let highestSGPA = 0;
      const recentActivity = [];

      for (const semester of semestersData) {
        if (semester.subjects && semester.subjects.length > 0) {
          totalCourses += semester.subjects.length;
          let semCredits = 0;
          let semWeightedGPA = 0;

          // Calculate semester SGPA
          semester.subjects.forEach((subject) => {
            if (subject.gradePoint !== null && subject.gradePoint !== undefined) {
              totalCredits += subject.credits;
              totalWeightedGPA += subject.gradePoint * subject.credits;
              semCredits += subject.credits;
              semWeightedGPA += subject.gradePoint * subject.credits;
            }
          });

          const sgpa = semCredits > 0 ? semWeightedGPA / semCredits : 0;
          semesterSGPAs.push(sgpa);

          if (sgpa > highestSGPA) {
            highestSGPA = sgpa;
            topSemester = semester.semesterNumber;
          }

          // Track recent activity
          const semesterDate = new Date(semester.updatedAt || semester.createdAt);
          const daysSinceUpdate = Math.floor((Date.now() - semesterDate) / (1000 * 60 * 60 * 24));
          
          if (daysSinceUpdate < 30) {
            recentActivity.push({
              type: 'semester_update',
              semester: semester.semesterNumber,
              date: semesterDate,
              subjectCount: semester.subjects.length,
            });
          }
        }
      }

      const overallCGPA = totalCredits > 0 ? totalWeightedGPA / totalCredits : null;
      const averageSGPA = semesterSGPAs.length > 0 
        ? semesterSGPAs.reduce((a, b) => a + b, 0) / semesterSGPAs.length 
        : 0;
      const lowestSGPA = semesterSGPAs.length > 0 ? Math.min(...semesterSGPAs) : 0;

      setStats({
        cgpa: overallCGPA,
        totalSemesters: semestersData.length,
        totalCredits: totalCredits,
        completedCourses: totalCourses,
        averageSGPA: averageSGPA,
        highestSGPA: highestSGPA,
        lowestSGPA: lowestSGPA,
        topPerformingSemester: topSemester,
        recentActivity: recentActivity.slice(0, 5),
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
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Profile Warning - if college not set */}
          {user?.college?.name === 'Default College' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-black mb-1">Complete Your Profile</h3>
                  <p className="text-sm text-gray-600 mb-3">Select your college to get accurate CGPA calculations.</p>
                  <button
                    onClick={() => navigate('/complete-profile')}
                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                  >
                    Select College
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold text-black tracking-tight mb-3">
              Welcome back, {user?.username}
            </h1>
            <p className="text-lg text-gray-600">Here's your academic overview.</p>
          </motion.div>

          {/* Hero Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Current CGPA</h3>
              <p className="text-3xl font-bold text-black">{stats.cgpa ? stats.cgpa.toFixed(2) : '0.00'}</p>
              <p className="text-xs text-gray-500 mt-1">Out of 10.0</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Semesters</h3>
              <p className="text-3xl font-bold text-black">{stats.totalSemesters}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.totalSemesters} completed</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Credits</h3>
              <p className="text-3xl font-bold text-black">{stats.totalCredits}</p>
              <p className="text-xs text-gray-500 mt-1">Credits earned</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Completed Courses</h3>
              <p className="text-3xl font-bold text-black">{stats.completedCourses}</p>
              <p className="text-xs text-gray-500 mt-1">Total subjects</p>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Left Column - CGPA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <CGPACard
                cgpa={stats.cgpa}
                lastUpdated={new Date().toISOString()}
                semesterData={chartData}
              />
            </motion.div>

            {/* Right Column - Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">Recent Activity</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              {stats.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black">Semester {activity.semester} Updated</p>
                        <p className="text-xs text-gray-600">{activity.subjectCount} subjects tracked</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {Math.floor((Date.now() - activity.date) / (1000 * 60 * 60 * 24))}d ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Performance Insights */}
          {semesters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-black tracking-tight mb-6">Performance Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-600">Average SGPA</h3>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-black mb-1">{stats.averageSGPA.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Across all semesters</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-600">Top Performance</h3>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-black mb-1">{stats.highestSGPA.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    {stats.topPerformingSemester ? `Semester ${stats.topPerformingSemester}` : 'N/A'}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-600">Improvement Needed</h3>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-black mb-1">{stats.lowestSGPA.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Lowest semester SGPA</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Academic Progress Timeline */}
          {semesters.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-black tracking-tight mb-6">Academic Progress</h2>
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <div className="space-y-6">
                  {chartData.slice(0, 4).map((sem, index) => (
                    <div key={sem.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
                        {sem.semesterNumber}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Semester {sem.semesterNumber}</span>
                          <span className="text-sm font-bold text-black">{sem.cgpa.toFixed(2)} SGPA</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-black h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(sem.cgpa / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{sem.credits} credits</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Stats Grid */}
          {semesters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-black tracking-tight mb-6">At a Glance</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-black">{stats.totalSemesters}</p>
                  <p className="text-xs text-gray-600 mt-1">Total Semesters</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-black">{stats.completedCourses}</p>
                  <p className="text-xs text-gray-600 mt-1">Courses Taken</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-black">{stats.totalCredits}</p>
                  <p className="text-xs text-gray-600 mt-1">Credits Earned</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-black">
                    {stats.completedCourses > 0 ? (stats.totalCredits / stats.completedCourses).toFixed(1) : '0'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Avg Credits/Course</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Semester Overview Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-black tracking-tight">Your Semesters</h2>
                <p className="text-sm text-gray-600 mt-2">
                  {semesters.length > 0 
                    ? `Managing ${semesters.length} ${semesters.length === 1 ? 'semester' : 'semesters'}`
                    : 'Start tracking your academic journey'
                  }
                </p>
              </div>
              {semesters.length > 0 && (
                <button
                  onClick={handleAddSemester}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Semester</span>
                </button>
              )}
            </div>

            {/* Empty State */}
            {semesters.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-black mb-3 tracking-tight">No semesters yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Start tracking your academic journey by adding your first semester. Monitor your CGPA and performance over time.
                </p>
                <button
                  onClick={handleAddSemester}
                  className="px-8 py-3.5 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all inline-flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
        <footer className="border-t border-gray-200 bg-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-sm text-gray-500">
              © 2025 CGPA Analyzer. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Add Semester Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black tracking-tight">Add New Semester</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreateSemester}>
                <div className="mb-6">
                  <label htmlFor="semesterNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    Semester Number
                  </label>
                  <input
                    type="number"
                    id="semesterNumber"
                    value={newSemesterNumber}
                    onChange={(e) => setNewSemesterNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black placeholder-gray-400"
                    placeholder="Enter semester number (e.g., 1, 2, 3...)"
                    min="1"
                    required
                    autoFocus
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewSemesterNumber('');
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    disabled={creatingSemester}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
                    disabled={creatingSemester}
                  >
                    {creatingSemester ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      'Create Semester'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
