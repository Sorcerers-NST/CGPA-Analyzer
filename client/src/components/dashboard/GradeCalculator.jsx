import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * GradeCalculator Component
 * Interactive calculator to predict grades needed
 * Helps students plan their academic goals
 */
const GradeCalculator = ({ currentCGPA, totalCredits }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetCGPA, setTargetCGPA] = useState('');
  const [remainingCredits, setRemainingCredits] = useState('');
  const [result, setResult] = useState(null);

  const calculateRequiredGPA = () => {
    const target = parseFloat(targetCGPA);
    const remaining = parseFloat(remainingCredits);
    const current = currentCGPA || 0;
    const earned = totalCredits || 0;

    if (!target || !remaining || target < 0 || target > 10 || remaining <= 0) {
      alert('Please enter valid values');
      return;
    }

    // Formula: Required SGPA = (Target CGPA × Total Credits - Current CGPA × Earned Credits) / Remaining Credits
    const totalCreditsAfter = earned + remaining;
    const requiredPoints = (target * totalCreditsAfter) - (current * earned);
    const requiredSGPA = requiredPoints / remaining;

    setResult({
      requiredSGPA: requiredSGPA.toFixed(2),
      isAchievable: requiredSGPA >= 0 && requiredSGPA <= 10,
      target,
      remaining,
    });
  };

  const reset = () => {
    setTargetCGPA('');
    setRemainingCredits('');
    setResult(null);
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        onClick={() => setIsOpen(true)}
        className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-2 border-gray-200 hover:border-black text-left group"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black">Grade Calculator</h3>
            </div>
            <p className="text-sm text-gray-600">Calculate what SGPA you need to achieve your target CGPA</p>
          </div>
          <svg className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </motion.button>

      {/* Calculator Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl max-w-lg w-full p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Grade Calculator</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Current Stats */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Current CGPA</p>
                    <p className="text-2xl font-bold text-black">{currentCGPA ? currentCGPA.toFixed(2) : '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Earned Credits</p>
                    <p className="text-2xl font-bold text-black">{totalCredits || 0}</p>
                  </div>
                </div>
              </div>

              {/* Input Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={targetCGPA}
                    onChange={(e) => setTargetCGPA(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black"
                    placeholder="e.g., 8.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remaining Credits
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={remainingCredits}
                    onChange={(e) => setRemainingCredits(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black"
                    placeholder="e.g., 20"
                  />
                </div>
              </div>

              {/* Result Display */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg p-6 mb-6 ${
                    result.isAchievable 
                      ? 'bg-black text-white' 
                      : 'bg-red-50 border-2 border-red-200'
                  }`}
                >
                  <h3 className={`text-sm font-medium mb-2 ${
                    result.isAchievable ? 'text-gray-300' : 'text-red-600'
                  }`}>
                    {result.isAchievable ? 'Required SGPA' : 'Not Achievable'}
                  </h3>
                  <p className={`text-4xl font-bold mb-2 ${
                    result.isAchievable ? 'text-white' : 'text-red-600'
                  }`}>
                    {result.requiredSGPA}
                  </p>
                  <p className={`text-sm ${
                    result.isAchievable ? 'text-gray-300' : 'text-red-600'
                  }`}>
                    {result.isAchievable 
                      ? `You need an average SGPA of ${result.requiredSGPA} in your next ${result.remaining} credits to reach ${result.target} CGPA.`
                      : `Target of ${result.target} CGPA is not achievable with ${result.remaining} remaining credits. Try a different target.`
                    }
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={reset}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={calculateRequiredGPA}
                  className="flex-1 px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                >
                  Calculate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GradeCalculator;
