import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

/**
 * GradeDistribution Component
 * Visual breakdown of grades across all subjects
 * Shows grade distribution with pie chart
 */
const GradeDistribution = ({ semesters }) => {
  // Aggregate all subjects from all semesters
  const allSubjects = semesters.flatMap(sem => sem.subjects || []);

  // Count grades
  const gradeCount = {};
  const gradeRanges = {
    'O (9-10)': { min: 9, max: 10, count: 0, color: '#000000' },
    'A+ (8-9)': { min: 8, max: 9, count: 0, color: '#404040' },
    'A (7-8)': { min: 7, max: 8, count: 0, color: '#666666' },
    'B+ (6-7)': { min: 6, max: 7, count: 0, color: '#808080' },
    'B (5-6)': { min: 5, max: 6, count: 0, color: '#999999' },
    'Below 5': { min: 0, max: 5, count: 0, color: '#CCCCCC' },
  };

  allSubjects.forEach(subject => {
    const gp = subject.gradePoint || 0;
    for (const [range, data] of Object.entries(gradeRanges)) {
      if (gp >= data.min && gp < data.max) {
        data.count++;
        break;
      }
    }
  });

  // Prepare chart data
  const chartData = Object.entries(gradeRanges)
    .filter(([_, data]) => data.count > 0)
    .map(([range, data]) => ({
      name: range,
      value: data.count,
      color: data.color,
    }));

  const totalSubjects = allSubjects.length;

  // Custom label
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (totalSubjects === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-black mb-4">Grade Distribution</h3>
        <div className="flex items-center justify-center h-48 text-gray-400">
          <p className="text-sm">No data available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-black mb-4">Grade Distribution</h3>
      
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              color: '#000',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            itemStyle={{
              color: '#000'
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <span className="font-semibold text-black">
              {item.value} ({((item.value / totalSubjects) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Subjects</span>
          <span className="text-lg font-bold text-black">{totalSubjects}</span>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Insights</h4>
        <div className="space-y-2">
          {/* Excellent Performance */}
          {(() => {
            const excellentCount = allSubjects.filter(s => s.gradePoint >= 9).length;
            return (
              <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 border border-green-100">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-green-700">Excellent (9-10)</span>
                </div>
                <span className="text-sm font-bold text-green-700">{excellentCount} {excellentCount === 1 ? 'subject' : 'subjects'}</span>
              </div>
            );
          })()}

          {/* Consistent Performance */}
          {(() => {
            const consistentCount = allSubjects.filter(s => s.gradePoint >= 7 && s.gradePoint < 9).length;
            return (
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm font-medium text-blue-700">Consistent (7-9)</span>
                </div>
                <span className="text-sm font-bold text-blue-700">{consistentCount} {consistentCount === 1 ? 'subject' : 'subjects'}</span>
              </div>
            );
          })()}

          {/* Need Improvement */}
          {(() => {
            const needsImprovementCount = allSubjects.filter(s => s.gradePoint < 7).length;
            return (
              <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50 border border-orange-100">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm font-medium text-orange-700">Need Improvement (&lt;7)</span>
                </div>
                <span className="text-sm font-bold text-orange-700">{needsImprovementCount} {needsImprovementCount === 1 ? 'subject' : 'subjects'}</span>
              </div>
            );
          })()}
        </div>
      </div>
    </motion.div>
  );
};

export default GradeDistribution;
