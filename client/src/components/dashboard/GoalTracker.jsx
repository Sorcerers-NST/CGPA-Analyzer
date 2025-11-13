import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiTrendingUp, FiAward, FiEdit2, FiCheck, FiX } from 'react-icons/fi';

function GoalTracker({ currentCGPA, semesters }) {
  const [targetCGPA, setTargetCGPA] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('targetCGPA');
    if (saved) {
      setTargetCGPA(parseFloat(saved));
    }
  }, []);

  // Save to localStorage
  const saveTarget = () => {
    const value = parseFloat(inputValue);
    if (value && value >= 0 && value <= 10) {
      setTargetCGPA(value);
      localStorage.setItem('targetCGPA', value.toString());
      setIsEditing(false);
      setInputValue('');
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setInputValue('');
  };

  const removeTarget = () => {
    setTargetCGPA(null);
    localStorage.removeItem('targetCGPA');
  };

  // Calculate progress
  const progress = targetCGPA && currentCGPA 
    ? Math.min((currentCGPA / targetCGPA) * 100, 100) 
    : 0;

  const difference = targetCGPA ? (targetCGPA - currentCGPA).toFixed(2) : 0;
  const isAchieved = currentCGPA >= targetCGPA;

  // Calculate required SGPA for remaining semesters (assuming 8 total semesters)
  const totalSemesters = 8;
  const completedSemesters = semesters.length;
  const remainingSemesters = totalSemesters - completedSemesters;
  
  const totalCredits = semesters.reduce((sum, sem) => 
    sum + (sem.subjects?.reduce((s, sub) => s + sub.credits, 0) || 0), 0
  );
  
  const avgCreditsPerSemester = completedSemesters > 0 
    ? Math.ceil(totalCredits / completedSemesters) 
    : 20;
  
  const estimatedRemainingCredits = remainingSemesters * avgCreditsPerSemester;
  const totalEstimatedCredits = totalCredits + estimatedRemainingCredits;
  
  const requiredSGPA = targetCGPA && remainingSemesters > 0
    ? ((targetCGPA * totalEstimatedCredits) - (currentCGPA * totalCredits)) / estimatedRemainingCredits
    : 0;

  const isAchievable = requiredSGPA <= 10 && requiredSGPA >= 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FiTarget className="w-5 h-5" />
          <h3 className="text-xl font-bold">Goal Tracker</h3>
        </div>
        
        {targetCGPA && !isEditing && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setInputValue(targetCGPA.toString());
                setIsEditing(true);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiEdit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={removeTarget}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {!targetCGPA && !isEditing ? (
        // No Target Set
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTarget className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="font-semibold mb-2">Set Your CGPA Goal</h4>
          <p className="text-sm text-gray-600 mb-6">
            Track your progress toward your target CGPA
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Set Goal
          </motion.button>
        </div>
      ) : isEditing ? (
        // Edit Mode
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target CGPA
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter target CGPA (0-10)"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveTarget}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiCheck className="w-4 h-4" />
              <span>Save Goal</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={cancelEdit}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      ) : (
        // Target Set - Show Progress
        <div className="space-y-6">
          {/* Current vs Target */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current CGPA</p>
              <p className="text-3xl font-bold">{currentCGPA || '0.00'}</p>
            </div>
            <div className="p-4 bg-black text-white rounded-lg">
              <p className="text-sm text-gray-300 mb-1">Target CGPA</p>
              <p className="text-3xl font-bold">{targetCGPA}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold">{progress.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  isAchieved ? 'bg-green-500' : progress >= 80 ? 'bg-blue-500' : 'bg-gray-800'
                }`}
              />
            </div>
          </div>

          {/* Status Message */}
          {isAchieved ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3"
            >
              <FiAward className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Goal Achieved! 🎉</p>
                <p className="text-sm text-green-700">Congratulations on reaching your target!</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FiTrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 mb-1">Keep Going!</p>
                    <p className="text-sm text-blue-700">
                      You need <span className="font-bold">{difference}</span> more points to reach your goal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Required SGPA Calculation */}
              {remainingSemesters > 0 && (
                <div className={`p-4 rounded-lg border-2 ${
                  isAchievable 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    To Achieve Target:
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Remaining semesters: <span className="font-semibold">{remainingSemesters}</span></p>
                    <p>
                      • Required average SGPA: {' '}
                      <span className={`font-bold ${
                        isAchievable ? 'text-gray-900' : 'text-red-600'
                      }`}>
                        {requiredSGPA.toFixed(2)}
                      </span>
                    </p>
                    {!isAchievable && (
                      <p className="text-red-600 font-medium mt-2">
                        ⚠️ This target may not be achievable with remaining semesters.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GoalTracker;
