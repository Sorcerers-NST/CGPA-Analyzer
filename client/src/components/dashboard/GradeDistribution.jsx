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
    </motion.div>
  );
};

export default GradeDistribution;
