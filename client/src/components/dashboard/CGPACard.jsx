import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CGPACard = ({ cgpa = 0, lastUpdated, semesterData = [] }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Prepare chart data
  const chartData = semesterData.length > 0 
    ? semesterData.map((sem, index) => ({
        semester: `Sem ${sem.semesterNumber || index + 1}`,
        cgpa: sem.cgpa || 0,
      }))
    : [
        { semester: 'Sem 1', cgpa: 7.5 },
        { semester: 'Sem 2', cgpa: 8.0 },
        { semester: 'Sem 3', cgpa: 8.3 },
        { semester: 'Sem 4', cgpa: 8.5 },
      ];

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white px-3 py-2 rounded-md text-xs shadow-lg">
          <p className="font-medium">{payload[0].payload.semester}</p>
          <p className="text-gray-300">CGPA: {payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-black">Current CGPA</h2>
        <div className="px-3 py-1 bg-gray-100 rounded-full">
          <p className="text-xs text-gray-600">
            Updated: {formatDate(lastUpdated)}
          </p>
        </div>
      </div>

      {/* CGPA Display */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block"
        >
          <div className="text-6xl font-bold text-black mb-2">
            {cgpa ? cgpa.toFixed(2) : '0.00'}
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Out of 10.0
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Progress Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="semester" 
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
            <Line 
              type="monotone" 
              dataKey="cgpa" 
              stroke="#000000" 
              strokeWidth={2}
              dot={{ fill: '#000000', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-black">
            {semesterData.length || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Semesters</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-black">
            {semesterData.reduce((sum, sem) => sum + (sem.credits || 0), 0) || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Credits</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-black">
            {semesterData.reduce((sum, sem) => sum + (sem.subjects?.length || 0), 0) || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Courses</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CGPACard;
