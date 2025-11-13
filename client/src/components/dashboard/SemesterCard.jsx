import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * SemesterCard Component
 * Individual semester card with hover animations
 * Clean, minimal design
 */
const SemesterCard = ({ semester, index }) => {
  const navigate = useNavigate();

  // Calculate progress percentage (example: based on completed courses)
  const calculateProgress = () => {
    if (!semester.subjects || semester.subjects.length === 0) return 0;
    const completedCourses = semester.subjects.filter(sub => sub.grade).length;
    return (completedCourses / semester.subjects.length) * 100;
  };

  const progress = calculateProgress();
  const sgpa = semester.sgpa || 0;
  const subjectCount = semester.subjects?.length || 0;
  const credits = semester.subjects?.reduce((sum, sub) => sum + (sub.credits || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 cursor-pointer"
      onClick={() => navigate(`/semester/${semester.id}`)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-black">
            Semester {semester.semesterNumber}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {semester.startDate 
              ? new Date(semester.startDate).getFullYear()
              : 'Academic Year'}
          </p>
        </div>

        {/* SGPA Badge */}
        <div className="bg-black text-white px-4 py-2 rounded-lg">
          <p className="text-xs font-medium text-gray-300">SGPA</p>
          <p className="text-xl font-bold">{sgpa.toFixed(2)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-600">Progress</span>
          <span className="text-xs font-medium text-gray-900">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
            className="bg-black h-full rounded-full"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-600">Courses</p>
          <p className="text-lg font-semibold text-black mt-1">
            {subjectCount}
          </p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-600">Credits</p>
          <p className="text-lg font-semibold text-black mt-1">
            {credits}
          </p>
        </div>
      </div>

      {/* View Details Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/semester/${semester.id}`);
        }}
        className="w-full py-2.5 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <span>View Details</span>
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </motion.div>
  );
};

export default SemesterCard;
