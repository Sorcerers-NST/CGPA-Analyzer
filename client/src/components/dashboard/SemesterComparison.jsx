import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function SemesterComparison({ semesters }) {
  const comparisonData = useMemo(() => {
    return semesters.map(sem => {
      const subjects = sem.subjects || [];
      const completedSubjects = subjects.filter(s => s.gradePoint != null);
      
      const totalCredits = completedSubjects.reduce((sum, sub) => sum + sub.credits, 0);
      const semWeightedGPA = completedSubjects.reduce((sum, sub) => 
        sum + (sub.gradePoint * sub.credits), 0
      );
      
      const calculatedSGPA = totalCredits > 0 ? semWeightedGPA / totalCredits : 0;
      const sgpa = sem.sgpa || parseFloat(calculatedSGPA.toFixed(2));
      
      const totalSubjects = subjects.length;
      
      return {
        name: sem.name ? sem.name.replace('Semester', 'Sem') : `Sem ${sem.semesterNumber}`,
        sgpa: sgpa,
        credits: totalCredits,
        subjects: totalSubjects,
        avgGradePoint: completedSubjects.length > 0
          ? (completedSubjects.reduce((sum, sub) => sum + sub.gradePoint, 0) / completedSubjects.length).toFixed(2)
          : 0
      };
    });
  }, [semesters]);

  const insights = useMemo(() => {
    if (semesters.length === 0) return null;

    const sgpas = comparisonData.map(s => s.sgpa).filter(s => s > 0);
    if (sgpas.length === 0) return null;

    const highest = Math.max(...sgpas);
    const lowest = Math.min(...sgpas);
    const average = sgpas.reduce((a, b) => a + b, 0) / sgpas.length;
    
    // Find trend
    let trend = 'stable';
    if (sgpas.length >= 2) {
      const recentAvg = sgpas.slice(-2).reduce((a, b) => a + b, 0) / 2;
      const olderAvg = sgpas.slice(0, -2).reduce((a, b) => a + b, 0) / (sgpas.length - 2) || recentAvg;
      
      if (recentAvg > olderAvg + 0.2) trend = 'improving';
      else if (recentAvg < olderAvg - 0.2) trend = 'declining';
    }

    const bestSemester = comparisonData.find(s => s.sgpa === highest);
    const worstSemester = comparisonData.find(s => s.sgpa === lowest);

    return {
      highest,
      lowest,
      average: average.toFixed(2),
      trend,
      bestSemester: bestSemester?.name,
      worstSemester: worstSemester?.name,
      variance: (highest - lowest).toFixed(2)
    };
  }, [semesters]);

  if (semesters.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Semester Comparison</h3>
        <div className="text-center py-12 text-gray-600">
          <p>Add semesters to see comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">Semester Comparison</h3>

      {/* Insights Cards */}
      {insights && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <p className="text-sm text-gray-600 mb-1">Highest SGPA</p>
            <p className="text-2xl font-bold">{insights.highest}</p>
            <p className="text-xs text-gray-500 mt-1">{insights.bestSemester}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <p className="text-sm text-gray-600 mb-1">Lowest SGPA</p>
            <p className="text-2xl font-bold">{insights.lowest}</p>
            <p className="text-xs text-gray-500 mt-1">{insights.worstSemester}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <p className="text-sm text-gray-600 mb-1">Average SGPA</p>
            <p className="text-2xl font-bold">{insights.average}</p>
            <p className="text-xs text-gray-500 mt-1">Across all semesters</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <p className="text-sm text-gray-600 mb-1">Trend</p>
            <p className="text-2xl font-bold capitalize">{insights.trend}</p>
            <p className="text-xs text-gray-500 mt-1">Variance: {insights.variance}</p>
          </motion.div>
        </div>
      )}

      {/* SGPA Comparison Chart */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-600 mb-4">SGPA Across Semesters</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#999"
            />
            <YAxis 
              domain={[0, 10]}
              tick={{ fontSize: 12 }}
              stroke="#999"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="sgpa" 
              stroke="#000" 
              strokeWidth={3}
              dot={{ fill: '#000', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Credits & Subjects Comparison */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-4">Workload Comparison</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#999"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#999"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend />
            <Bar dataKey="credits" fill="#000" name="Credits" radius={[8, 8, 0, 0]} />
            <Bar dataKey="subjects" fill="#666" name="Subjects" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Semester</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">SGPA</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">Credits</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">Subjects</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">Avg Grade Pt</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((sem, index) => (
              <motion.tr
                key={sem.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-2 font-medium">{sem.name}</td>
                <td className="text-center py-3 px-2">
                  <span className="inline-block px-3 py-1 bg-black text-white rounded-lg font-semibold">
                    {sem.sgpa}
                  </span>
                </td>
                <td className="text-center py-3 px-2 text-gray-600">{sem.credits}</td>
                <td className="text-center py-3 px-2 text-gray-600">{sem.subjects}</td>
                <td className="text-center py-3 px-2 text-gray-600">{sem.avgGradePoint}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SemesterComparison;
