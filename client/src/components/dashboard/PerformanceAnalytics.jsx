import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

function PerformanceAnalytics({ semesters }) {
  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    if (!semesters || semesters.length === 0) return null;

    // Trend data for area chart
    let cumulativeCGPA = 0;
    let totalCredits = 0;
    let totalWeightedGPA = 0;

    const trendData = semesters.map((sem, index) => {
      // Calculate semester stats
      const semCredits = sem.subjects?.reduce((sum, sub) => sum + sub.credits, 0) || 0;
      const semWeightedGPA = sem.subjects?.reduce((sum, sub) => 
        sum + (sub.gradePoint * sub.credits), 0
      ) || 0;

      totalCredits += semCredits;
      totalWeightedGPA += semWeightedGPA;
      cumulativeCGPA = totalCredits > 0 ? totalWeightedGPA / totalCredits : 0;

      return {
        name: sem.name.replace('Semester', 'S'),
        sgpa: sem.sgpa || 0,
        cgpa: parseFloat(cumulativeCGPA.toFixed(2)),
        credits: semCredits,
      };
    });

    // Performance categories (for radar chart)
    const categories = {
      consistency: 0,
      trend: 0,
      workload: 0,
      excellence: 0,
      progress: 0
    };

    // 1. Consistency (variance in SGPA)
    const sgpas = semesters.map(s => s.sgpa || 0).filter(s => s > 0);
    if (sgpas.length > 0) {
      const avg = sgpas.reduce((a, b) => a + b) / sgpas.length;
      const variance = sgpas.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / sgpas.length;
      categories.consistency = Math.max(0, 100 - (variance * 20)); // Lower variance = higher consistency
    }

    // 2. Trend (improving/declining)
    if (sgpas.length >= 2) {
      const firstHalf = sgpas.slice(0, Math.ceil(sgpas.length / 2));
      const secondHalf = sgpas.slice(Math.ceil(sgpas.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b) / secondHalf.length;
      const improvement = ((secondAvg - firstAvg) / 10) * 100;
      categories.trend = Math.min(100, Math.max(0, 50 + improvement * 10));
    } else {
      categories.trend = 50;
    }

    // 3. Workload (credits per semester)
    const avgCredits = totalCredits / semesters.length;
    categories.workload = Math.min(100, (avgCredits / 30) * 100); // Assuming 30 credits is max

    // 4. Excellence (percentage of high grades)
    let totalSubjects = 0;
    let excellentGrades = 0;
    semesters.forEach(sem => {
      sem.subjects?.forEach(sub => {
        totalSubjects++;
        if (sub.gradePoint >= 9) excellentGrades++; // O or A+ grades
      });
    });
    categories.excellence = totalSubjects > 0 ? (excellentGrades / totalSubjects) * 100 : 0;

    // 5. Progress (current CGPA relative to scale)
    categories.progress = (cumulativeCGPA / 10) * 100;

    const radarData = [
      { category: 'Consistency', value: categories.consistency },
      { category: 'Trend', value: categories.trend },
      { category: 'Excellence', value: categories.excellence },
      { category: 'Progress', value: categories.progress },
      { category: 'Workload', value: categories.workload }
    ];

    // Calculate trend direction
    let trendDirection = 'stable';
    if (sgpas.length >= 2) {
      const recent = sgpas[sgpas.length - 1];
      const previous = sgpas[sgpas.length - 2];
      if (recent > previous + 0.2) trendDirection = 'improving';
      else if (recent < previous - 0.2) trendDirection = 'declining';
    }

    // Calculate streaks
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < sgpas.length; i++) {
      if (sgpas[i] >= 8.0) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    // Current streak (from end)
    for (let i = sgpas.length - 1; i >= 0; i--) {
      if (sgpas[i] >= 8.0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      trendData,
      radarData,
      trendDirection,
      currentStreak,
      maxStreak,
      overallCGPA: cumulativeCGPA.toFixed(2),
      avgSGPA: (sgpas.reduce((a, b) => a + b, 0) / sgpas.length).toFixed(2),
      totalSubjects: totalSubjects,
      avgCredits: avgCredits.toFixed(1)
    };
  }, [semesters]);

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Performance Analytics</h3>
        <div className="text-center py-12 text-gray-600">
          <p>Add semesters to see detailed analytics</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = () => {
    switch (analytics.trendDirection) {
      case 'improving':
        return <FiTrendingUp className="w-5 h-5 text-green-600" />;
      case 'declining':
        return <FiTrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <FiMinus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (analytics.trendDirection) {
      case 'improving':
        return 'text-green-600 bg-green-50';
      case 'declining':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Performance Analytics</h3>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-semibold capitalize">{analytics.trendDirection}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <p className="text-sm text-gray-600 mb-1">Overall CGPA</p>
          <p className="text-2xl font-bold">{analytics.overallCGPA}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <p className="text-sm text-gray-600 mb-1">Avg SGPA</p>
          <p className="text-2xl font-bold">{analytics.avgSGPA}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <p className="text-sm text-gray-600 mb-1">Current Streak</p>
          <p className="text-2xl font-bold">
            {analytics.currentStreak > 0 ? `${analytics.currentStreak} 🔥` : '0'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Semesters ≥ 8.0</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <p className="text-sm text-gray-600 mb-1">Best Streak</p>
          <p className="text-2xl font-bold">
            {analytics.maxStreak > 0 ? `${analytics.maxStreak} ⭐` : '0'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Max consecutive</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-4">CGPA & SGPA Progression</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analytics.trendData}>
              <defs>
                <linearGradient id="colorCGPA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSGPA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#666" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#666" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="cgpa" 
                stroke="#000" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCGPA)"
                name="Cumulative CGPA"
              />
              <Area 
                type="monotone" 
                dataKey="sgpa" 
                stroke="#666" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorSGPA)"
                name="Semester SGPA"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-4">Performance Profile</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={analytics.radarData}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#999' }}
              />
              <Radar 
                name="Performance" 
                dataKey="value" 
                stroke="#000" 
                fill="#000" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value) => `${value.toFixed(1)}%`}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Subjects</p>
          <p className="text-xl font-bold">{analytics.totalSubjects}</p>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Avg Credits/Sem</p>
          <p className="text-xl font-bold">{analytics.avgCredits}</p>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Completion</p>
          <p className="text-xl font-bold">{semesters.length}/8 Sems</p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black rounded-full"
              style={{ width: `${(semesters.length / 8) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-semibold mb-2 text-sm">💡 Performance Insights</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          {analytics.trendDirection === 'improving' && (
            <li>• Great job! Your performance is trending upward. Keep it up! 📈</li>
          )}
          {analytics.trendDirection === 'declining' && (
            <li>• Focus on improving your study habits. You can turn this around! 💪</li>
          )}
          {analytics.currentStreak >= 3 && (
            <li>• Amazing streak! You're maintaining excellent performance consistently! 🔥</li>
          )}
          {analytics.currentStreak === 0 && analytics.maxStreak > 0 && (
            <li>• You've had great streaks before. Let's start a new one! 🎯</li>
          )}
          {parseFloat(analytics.avgCredits) < 15 && (
            <li>• Consider taking more credits per semester if possible. ⚡</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default PerformanceAnalytics;
