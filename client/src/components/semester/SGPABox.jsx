import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * SGPABox Component
 * Displays semester SGPA with subject grade distribution chart
 * Clean, minimalist design
 */
const SGPABox = ({ sgpa = 0, subjects = [], lastUpdated }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Today';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Prepare chart data from subjects
  const chartData = subjects.length > 0 
    ? subjects.map((subject, index) => ({
        name: subject.name.length > 15 
          ? subject.name.substring(0, 12) + '...' 
          : subject.name,
        gp: subject.gradePoint || 0,
        fullName: subject.name,
      }))
    : [
        { name: 'Math', gp: 8.5 },
        { name: 'Physics', gp: 9.0 },
        { name: 'Chemistry', gp: 7.5 },
      ];

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white px-3 py-2 rounded-md text-xs shadow-lg">
          <p className="font-medium">{payload[0].payload.fullName || payload[0].payload.name}</p>
          <p className="text-gray-300">Grade Point: {payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate stats
  const totalCredits = subjects.reduce((sum, sub) => sum + (sub.credits || 0), 0);
  const totalSubjects = subjects.length;
  const avgGradePoint = subjects.length > 0 
    ? subjects.reduce((sum, sub) => sum + (sub.gradePoint || 0), 0) / subjects.length 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 mb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-black">Semester SGPA</h2>
        <div className="px-3 py-1 bg-gray-100 rounded-full">
          <p className="text-xs text-gray-600">
            Updated: {formatDate(lastUpdated)}
          </p>
        </div>
      </div>

      {/* SGPA Display */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block"
        >
          <div className="text-6xl font-bold text-black mb-2">
            {sgpa ? sgpa.toFixed(2) : '0.00'}
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Out of 10.0
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      {subjects.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Subject Grade Points</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
                domain={[0, 10]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="gp" 
                fill="#000000" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-black">
            {totalSubjects}
          </p>
          <p className="text-xs text-gray-500 mt-1">Subjects</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-black">
            {totalCredits}
          </p>
          <p className="text-xs text-gray-500 mt-1">Credits</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-black">
            {avgGradePoint.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Avg GP</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SGPABox;
