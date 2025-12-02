import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const GradeDistribution = ({ semesters }) => {
  // Aggregate all subjects from all semesters
  const allSubjects = semesters.flatMap(sem => sem.subjects || []);
  const totalSubjects = allSubjects.length;

  // Define grade categories based on new system
  const gradeCategories = {
    'A+ (10)': { point: 10, count: 0, color: '#16a34a', range: 'Excellent' },
    'A (9)': { point: 9, count: 0, color: '#22c55e', range: 'Excellent' },
    'B+ (8)': { point: 8, count: 0, color: '#3b82f6', range: 'Good' },
    'B (7)': { point: 7, count: 0, color: '#60a5fa', range: 'Good' },
    'C+ (6)': { point: 6, count: 0, color: '#eab308', range: 'Average' },
    'C (5)': { point: 5, count: 0, color: '#facc15', range: 'Average' },
    'F (<5)': { maxPoint: 4, count: 0, color: '#ef4444', range: 'Needs Improvement' },
  };

  // Count subjects in each grade category
  allSubjects.forEach(subject => {
    const gp = subject.gradePoint || 0;
    let categorized = false;

    // Check exact grade points (10, 9, 8, 7, 6, 5)
    for (const [category, data] of Object.entries(gradeCategories)) {
      if (data.point !== undefined && gp === data.point) {
        data.count++;
        categorized = true;
        break;
      }
    }

    // If not categorized and below 5, it's F
    if (!categorized && gp < 5) {
      gradeCategories['F (<5)'].count++;
    }
  });

  // Prepare data for pie chart (only categories with subjects)
  const chartData = Object.entries(gradeCategories)
    .filter(([_, data]) => data.count > 0)
    .map(([name, data]) => ({
      name,
      value: data.count,
      color: data.color,
      percentage: ((data.count / totalSubjects) * 100).toFixed(1),
    }));

  // Calculate performance summary
  const performanceSummary = {
    excellent: allSubjects.filter(s => s.gradePoint >= 9).length,
    good: allSubjects.filter(s => s.gradePoint >= 7 && s.gradePoint < 9).length,
    average: allSubjects.filter(s => s.gradePoint >= 5 && s.gradePoint < 7).length,
    needsImprovement: allSubjects.filter(s => s.gradePoint < 5).length,
  };

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{data.name}</p>
          <p className="text-xs text-gray-600 mt-1">
            {data.value} {data.value === 1 ? 'subject' : 'subjects'} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Empty state
  if (totalSubjects === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
        <div className="flex items-center justify-center h-48 text-gray-400">
          <p className="text-sm">No subjects added yet</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Grade Distribution</h3>

      {/* Pie Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text showing total */}
        <div className="text-center -mt-40 pointer-events-none">
          <p className="text-3xl font-bold text-gray-900">{totalSubjects}</p>
          <p className="text-xs text-gray-500 mt-1">Total Subjects</p>
        </div>
      </div>

      {/* Grade Legend */}
      <div className="space-y-2 mb-6">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700 font-medium">{item.name}</span>
            </div>
            <span className="text-gray-900 font-semibold">
              {item.value} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>

      {/* Performance Insights */}
      <div className="pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Insights</h4>
        <div className="space-y-2">
          {/* Excellent */}
          {performanceSummary.excellent > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-700">Excellent (A+/A: 9-10)</span>
              </div>
              <span className="text-sm font-bold text-green-700">
                {performanceSummary.excellent}
              </span>
            </div>
          )}

          {/* Good */}
          {performanceSummary.good > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm font-medium text-blue-700">Good (B+/B: 7-8)</span>
              </div>
              <span className="text-sm font-bold text-blue-700">
                {performanceSummary.good}
              </span>
            </div>
          )}

          {/* Average */}
          {performanceSummary.average > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-yellow-700">Average (C+/C: 5-6)</span>
              </div>
              <span className="text-sm font-bold text-yellow-700">
                {performanceSummary.average}
              </span>
            </div>
          )}

          {/* Needs Improvement */}
          {performanceSummary.needsImprovement > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium text-red-700">Needs Improvement (F: &lt;5)</span>
              </div>
              <span className="text-sm font-bold text-red-700">
                {performanceSummary.needsImprovement}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GradeDistribution;
