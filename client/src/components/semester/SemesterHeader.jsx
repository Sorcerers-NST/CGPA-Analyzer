import { motion } from 'framer-motion';

const SemesterHeader = ({ semesterNumber, onAddSubject }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">
            Semester {semesterNumber}
          </h1>
          <p className="text-gray-600">
            Manage your subjects and view your performance.
          </p>
        </div>

        <button
          onClick={onAddSubject}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
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
          <span>Add Subject</span>
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mt-8"></div>
    </motion.div>
  );
};

export default SemesterHeader;
