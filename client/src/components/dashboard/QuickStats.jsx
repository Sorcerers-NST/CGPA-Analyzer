import { motion } from 'framer-motion';

const QuickStats = ({ stats }) => {
  const { cgpa, totalSemesters, totalCredits, completedCourses } = stats;

  const cgpaProgress = cgpa ? (cgpa / 10) * 100 : 0;

  // Determine performance level
  const getPerformanceLevel = () => {
    if (cgpa >= 9) return { text: 'Outstanding', color: 'text-black', bg: 'bg-black' };
    if (cgpa >= 8) return { text: 'Excellent', color: 'text-gray-700', bg: 'bg-gray-700' };
    if (cgpa >= 7) return { text: 'Good', color: 'text-gray-600', bg: 'bg-gray-600' };
    if (cgpa >= 6) return { text: 'Average', color: 'text-gray-500', bg: 'bg-gray-500' };
    return { text: 'Needs Improvement', color: 'text-gray-400', bg: 'bg-gray-400' };
  };

  const performance = getPerformanceLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-black mb-6">Quick Overview</h3>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Current CGPA</span>
          <span className={`text-sm font-semibold ${performance.color}`}>
            {performance.text}
          </span>
        </div>
        <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${cgpaProgress}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`${performance.bg} h-full rounded-full`}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">0.0</span>
          <span className="text-xs text-gray-500">10.0</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Semesters</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-black">{totalSemesters}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Credits</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-black">{totalCredits}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Courses</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-black">{completedCourses}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Avg/Course</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-black">
            {completedCourses > 0 ? (totalCredits / completedCourses).toFixed(1) : '0.0'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickStats;
