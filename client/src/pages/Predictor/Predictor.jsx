import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';

const Predictor = () => {
  const [targetCGPA, setTargetCGPA] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [predictions, setPredictions] = useState({});

  // Grade point to percentage mapping
  const gradeMapping = {
    10: { grade: 'A+', percentage: 100 },
    9: { grade: 'A', percentage: 90 },
    8: { grade: 'B+', percentage: 80 },
    7: { grade: 'B', percentage: 70 },
    6: { grade: 'C+', percentage: 60 },
    5: { grade: 'C', percentage: 50 },
  };

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('predictorData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.targetCGPA) setTargetCGPA(data.targetCGPA);
        if (data.subjects) setSubjects(data.subjects);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Auto-save data when it changes
  useEffect(() => {
    if (targetCGPA || subjects.length > 0) {
      localStorage.setItem('predictorData', JSON.stringify({
        targetCGPA,
        subjects,
      }));
    }
  }, [targetCGPA, subjects]);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      {
        id: Date.now(),
        name: '',
        credits: '',
        components: [{ name: '', maxMarks: '', obtainedMarks: '' }],
      },
    ]);
  };

  const removeSubject = (subjectId) => {
    setSubjects(subjects.filter(s => s.id !== subjectId));
  };

  const updateSubject = (subjectId, field, value) => {
    setSubjects(
      subjects.map(s => (s.id === subjectId ? { ...s, [field]: value } : s))
    );
  };

  const addComponent = (subjectId) => {
    setSubjects(
      subjects.map(s =>
        s.id === subjectId
          ? { ...s, components: [...s.components, { name: '', maxMarks: '', obtainedMarks: '' }] }
          : s
      )
    );
  };

  const removeComponent = (subjectId, componentIndex) => {
    setSubjects(
      subjects.map(s =>
        s.id === subjectId && s.components.length > 1
          ? {
              ...s,
              components: s.components.filter((_, i) => i !== componentIndex),
            }
          : s
      )
    );
  };

  const updateComponent = (subjectId, componentIndex, field, value) => {
    setSubjects(
      subjects.map(s =>
        s.id === subjectId
          ? {
              ...s,
              components: s.components.map((c, i) => {
                if (i === componentIndex) {
                  // Validate obtainedMarks doesn't exceed maxMarks
                  if (field === 'obtainedMarks') {
                    const maxMarks = parseFloat(c.maxMarks) || 0;
                    const obtained = parseFloat(value) || 0;
                    if (obtained > maxMarks && maxMarks > 0) {
                      return c; // Don't update if exceeds max
                    }
                  }
                  return { ...c, [field]: value };
                }
                return c;
              }),
            }
          : s
      )
    );
  };

  const calculateSmartPredictions = () => {
    const targetGP = parseFloat(targetCGPA);
    if (!targetGP || targetGP < 0 || targetGP > 10) {
      alert('Please enter a valid target CGPA (0-10)');
      return;
    }

    // Validation
    for (const subject of subjects) {
      if (!subject.name || !subject.credits) {
        alert('Please fill in all subject names and credits');
        return;
      }
      for (const comp of subject.components) {
        if (!comp.name || !comp.maxMarks) {
          alert('Please fill in all component names and max marks');
          return;
        }
      }
    }

    const gradePoint = Math.round(targetGP);
    const targetPercentage = gradeMapping[gradePoint]?.percentage || targetGP * 10;

    const newPredictions = {};

    subjects.forEach(subject => {
      const totalMaxMarks = subject.components.reduce(
        (sum, comp) => sum + (parseFloat(comp.maxMarks) || 0),
        0
      );

      if (totalMaxMarks === 0) return;

      const requiredTotal = (totalMaxMarks * targetPercentage) / 100;

      // Calculate marks already obtained
      let completedMarks = 0;
      let completedMax = 0;
      let remainingMax = 0;

      subject.components.forEach(comp => {
        const maxMarks = parseFloat(comp.maxMarks) || 0;
        const obtained = comp.obtainedMarks ? parseFloat(comp.obtainedMarks) : null;
        
        if (obtained !== null && obtained !== '') {
          // Component completed
          completedMarks += obtained;
          completedMax += maxMarks;
        } else {
          // Component pending
          remainingMax += maxMarks;
        }
      });

      // Calculate what's needed in remaining components
      const remainingNeeded = requiredTotal - completedMarks;
      const requiredPercentageRemaining = remainingMax > 0 
        ? (remainingNeeded / remainingMax) * 100 
        : 0;

      const componentPredictions = subject.components.map(comp => {
        const maxMarks = parseFloat(comp.maxMarks) || 0;
        const obtained = comp.obtainedMarks ? parseFloat(comp.obtainedMarks) : null;
        
        if (obtained !== null && obtained !== '') {
          // Already completed
          return {
            name: comp.name,
            maxMarks: maxMarks,
            obtained: obtained,
            recommended: obtained,
            percentage: maxMarks > 0 ? (obtained / maxMarks) * 100 : 0,
            completed: true,
          };
        } else {
          // Pending - calculate needed
          const needed = (maxMarks * requiredPercentageRemaining) / 100;
          return {
            name: comp.name,
            maxMarks: maxMarks,
            obtained: null,
            recommended: Math.round(needed * 10) / 10,
            percentage: requiredPercentageRemaining,
            completed: false,
          };
        }
      });

      newPredictions[subject.id] = {
        totalMax: totalMaxMarks,
        requiredTotal: Math.round(requiredTotal * 10) / 10,
        completedMarks: Math.round(completedMarks * 10) / 10,
        remainingNeeded: Math.round(remainingNeeded * 10) / 10,
        remainingMax: remainingMax,
        targetPercentage,
        requiredPercentageRemaining: Math.round(requiredPercentageRemaining * 10) / 10,
        components: componentPredictions,
      };
    });

    setPredictions(newPredictions);
  };

  const calculateForSubject = (subjectId) => {
    const targetGP = parseFloat(targetCGPA);
    if (!targetGP || targetGP < 0 || targetGP > 10) {
      alert('Please enter a valid target CGPA (0-10)');
      return;
    }

    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;

    // Validation for this subject
    if (!subject.name || !subject.credits) {
      alert('Please fill in subject name and credits');
      return;
    }
    for (const comp of subject.components) {
      if (!comp.name || !comp.maxMarks) {
        alert('Please fill in all component names and max marks');
        return;
      }
    }

    const gradePoint = Math.round(targetGP);
    const targetPercentage = gradeMapping[gradePoint]?.percentage || targetGP * 10;

    const totalMaxMarks = subject.components.reduce(
      (sum, comp) => sum + (parseFloat(comp.maxMarks) || 0),
      0
    );

    if (totalMaxMarks === 0) return;

    const requiredTotal = (totalMaxMarks * targetPercentage) / 100;

    // Calculate marks already obtained
    let completedMarks = 0;
    let completedMax = 0;
    let remainingMax = 0;

    subject.components.forEach(comp => {
      const maxMarks = parseFloat(comp.maxMarks) || 0;
      const obtained = comp.obtainedMarks ? parseFloat(comp.obtainedMarks) : null;
      
      if (obtained !== null && obtained !== '') {
        completedMarks += obtained;
        completedMax += maxMarks;
      } else {
        remainingMax += maxMarks;
      }
    });

    const remainingNeeded = requiredTotal - completedMarks;
    const requiredPercentageRemaining = remainingMax > 0 
      ? (remainingNeeded / remainingMax) * 100 
      : 0;

    const componentPredictions = subject.components.map(comp => {
      const maxMarks = parseFloat(comp.maxMarks) || 0;
      const obtained = comp.obtainedMarks ? parseFloat(comp.obtainedMarks) : null;
      
      if (obtained !== null && obtained !== '') {
        return {
          name: comp.name,
          maxMarks: maxMarks,
          obtained: obtained,
          recommended: obtained,
          percentage: maxMarks > 0 ? (obtained / maxMarks) * 100 : 0,
          completed: true,
        };
      } else {
        const needed = (maxMarks * requiredPercentageRemaining) / 100;
        return {
          name: comp.name,
          maxMarks: maxMarks,
          obtained: null,
          recommended: Math.round(needed * 10) / 10,
          percentage: requiredPercentageRemaining,
          completed: false,
        };
      }
    });

    setPredictions({
      ...predictions,
      [subjectId]: {
        totalMax: totalMaxMarks,
        requiredTotal: Math.round(requiredTotal * 10) / 10,
        completedMarks: Math.round(completedMarks * 10) / 10,
        remainingNeeded: Math.round(remainingNeeded * 10) / 10,
        remainingMax: remainingMax,
        targetPercentage,
        requiredPercentageRemaining: Math.round(requiredPercentageRemaining * 10) / 10,
        components: componentPredictions,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <style>{`
        /* Hide number input spinners */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">CGPA Predictor</h1>
          <p className="text-gray-600 mt-2">
            Track obtained marks and predict what you need in remaining assessments
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Target CGPA */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target CGPA
            </label>
            <input
              type="number"
              value={targetCGPA}
              onChange={(e) => setTargetCGPA(e.target.value)}
              placeholder="Enter target CGPA (e.g., 9.0)"
              step="0.1"
              min="0"
              max="10"
              className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {targetCGPA && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Target Grade:</strong>{' '}
                  {gradeMapping[Math.round(parseFloat(targetCGPA))]?.grade || 'Custom'} (
                  {gradeMapping[Math.round(parseFloat(targetCGPA))]?.percentage ||
                    parseFloat(targetCGPA) * 10}
                  % overall marks needed)
                </p>
              </div>
            )}
          </div>

          {/* Subjects Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Subjects & Assessments</h2>
              <div className="flex gap-2">
                {subjects.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all data? This cannot be undone.')) {
                        setSubjects([]);
                        setTargetCGPA('');
                        setPredictions({});
                        localStorage.removeItem('predictorData');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FiTrash2 /> Clear All
                  </button>
                )}
                <button
                  onClick={addSubject}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium shadow-sm"
                >
                  <FiPlus /> Add Subject
                </button>
              </div>
            </div>

            {subjects.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-gray-600 mb-4">No subjects added yet</p>
                <button
                  onClick={addSubject}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Click "Add Subject" to start
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {subjects.map((subject, subjectIndex) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                  >
                    {/* Subject Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Subject Name
                          </label>
                          <input
                            type="text"
                            value={subject.name}
                            onChange={(e) =>
                              updateSubject(subject.id, 'name', e.target.value)
                            }
                            placeholder="e.g., Data Structures"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Credits
                          </label>
                          <input
                            type="number"
                            value={subject.credits}
                            onChange={(e) =>
                              updateSubject(subject.id, 'credits', e.target.value)
                            }
                            placeholder="e.g., 4"
                            min="0"
                            step="0.5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeSubject(subject.id)}
                        className="text-red-600 hover:text-red-700 p-2 mt-5"
                        title="Remove Subject"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    {/* Assessment Components & Predictions Side by Side */}
                    <div className={`mt-4 grid gap-4 ${predictions[subject.id] ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
                      {/* Left: Assessment Components */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-gray-700">
                            Assessment Components
                          </label>
                          <button
                            onClick={() => addComponent(subject.id)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            + Add Component
                          </button>
                        </div>

                        <div className="space-y-2">
                          {/* Header Row */}
                          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-600 px-1">
                            <div className="col-span-5">Component</div>
                            <div className="col-span-2 text-center">Max Marks</div>
                            <div className="col-span-3 text-center">Marks Achieved</div>
                            <div className="col-span-2"></div>
                          </div>

                          {subject.components.map((component, componentIndex) => {
                            const isCompleted = component.obtainedMarks && component.obtainedMarks !== '';
                            
                            return (
                              <div key={componentIndex} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-5">
                                  <input
                                    type="text"
                                    value={component.name}
                                    onChange={(e) =>
                                      updateComponent(
                                        subject.id,
                                        componentIndex,
                                        'name',
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g., Mid Sem, End Sem"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    value={component.maxMarks}
                                    onChange={(e) =>
                                      updateComponent(
                                        subject.id,
                                        componentIndex,
                                        'maxMarks',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Max"
                                    min="0"
                                    step="0.5"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                                  />
                                </div>
                                <div className="col-span-3 relative">
                                  <input
                                    type="number"
                                    value={component.obtainedMarks}
                                    onChange={(e) =>
                                      updateComponent(
                                        subject.id,
                                        componentIndex,
                                        'obtainedMarks',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Got?"
                                    min="0"
                                    max={component.maxMarks || undefined}
                                    step="0.5"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm ${
                                      isCompleted 
                                        ? 'border-green-300 bg-green-50' 
                                        : 'border-gray-300 bg-white'
                                    }`}
                                  />
                                </div>
                                <div className="col-span-2 flex items-center gap-1">

                                  {subject.components.length > 1 && (
                                    <button
                                      onClick={() => removeComponent(subject.id, componentIndex)}
                                      className="text-red-600 hover:text-red-700 p-1 ml-auto"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Prediction Results (Only if calculated) */}
                      {predictions[subject.id] && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Smart Prediction
                          </h4>
                          
                          {/* Summary Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                            <div className="bg-white rounded-lg p-2 border border-blue-200">
                              <p className="text-xs text-blue-600 mb-0.5">Total Needed</p>
                              <p className="text-sm font-bold text-blue-900">
                                {predictions[subject.id].requiredTotal} / {predictions[subject.id].totalMax}
                                <span className="text-xs font-normal ml-1 block">
                                  ({predictions[subject.id].targetPercentage}%)
                                </span>
                              </p>
                            </div>
                            
                            {predictions[subject.id].completedMarks > 0 && (
                              <div className="bg-white rounded-lg p-2 border border-green-200">
                                <p className="text-xs text-green-600 mb-0.5">Already Got ✓</p>
                                <p className="text-sm font-bold text-green-900">
                                  {predictions[subject.id].completedMarks} marks
                                </p>
                              </div>
                            )}
                            
                            {(predictions[subject.id].remainingMax > 0 || predictions[subject.id].remainingNeeded > 0) && (
                              <div className={`rounded-lg p-2 border ${
                                predictions[subject.id].requiredPercentageRemaining > 100
                                  ? 'bg-white border-red-200'
                                  : 'bg-white border-orange-200'
                              }`}>
                                <p className={`text-xs mb-0.5 ${
                                  predictions[subject.id].requiredPercentageRemaining > 100
                                    ? 'text-red-600'
                                    : 'text-orange-600'
                                }`}>
                                  {predictions[subject.id].remainingMax > 0 ? 'Need in Remaining' : 'Target Status'}
                                </p>
                                <p className={`text-sm font-bold ${
                                  predictions[subject.id].requiredPercentageRemaining > 100
                                    ? 'text-red-900'
                                    : 'text-orange-900'
                                }`}>
                                  {predictions[subject.id].remainingMax > 0 ? (
                                    <>
                                      {predictions[subject.id].remainingNeeded} / {predictions[subject.id].remainingMax}
                                      <span className="text-xs font-normal ml-1 block">
                                        ({predictions[subject.id].requiredPercentageRemaining}%)
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      Short by {Math.abs(predictions[subject.id].remainingNeeded).toFixed(1)} marks
                                    </>
                                  )}
                                </p>
                                {predictions[subject.id].requiredPercentageRemaining > 100 && (
                                  <p className="text-xs text-red-600 mt-1 font-medium">
                                    ⚠️ Target unreachable!
                                  </p>
                                )}
                                {predictions[subject.id].remainingMax === 0 && predictions[subject.id].remainingNeeded > 0 && (
                                  <p className="text-xs text-red-600 mt-1 font-medium">
                                    ⚠️ All components completed but target not reached!
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Pending Components Only */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">You Need:</p>
                            <div className="space-y-1.5">
                              {predictions[subject.id].components
                                .filter(comp => !comp.completed) // Only show pending
                                .map((comp, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-white rounded-lg p-2 border border-orange-200"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-gray-700">
                                        {comp.name}
                                      </span>
                                      <span className="text-xs font-bold text-orange-900">
                                        {comp.recommended}/{comp.maxMarks}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      {Math.round(comp.percentage)}% required
                                    </div>
                                  </div>
                                ))}
                              {predictions[subject.id].components.every(c => c.completed) && (
                                <p className="text-xs text-green-600 italic">
                                  All components completed! ✓
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Calculate Button for this subject */}
                    <button
                      onClick={() => calculateForSubject(subject.id)}
                      disabled={!targetCGPA}
                      className="w-full mt-4 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 font-semibold py-3 px-4 rounded-lg transition-all disabled:cursor-not-allowed shadow-sm"
                    >
                      Calculate for {subject.name || 'this subject'}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}  
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictor;
