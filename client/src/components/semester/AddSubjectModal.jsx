import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/**
 * AddSubjectModal Component
 * Modal for adding new subjects with form validation
 * Clean, minimalist design
 */
const AddSubjectModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    credits: '',
    grade: '',
    gradePoint: '',
  });

  const [errors, setErrors] = useState({});

  // Grade options (10-point scale)
  const gradeOptions = [
    { grade: 'O', point: 10 },
    { grade: 'A+', point: 9 },
    { grade: 'A', point: 8 },
    { grade: 'B+', point: 7 },
    { grade: 'B', point: 6 },
    { grade: 'C', point: 5 },
    { grade: 'D', point: 4 },
    { grade: 'F', point: 0 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-fill grade point when grade is selected
    if (name === 'grade') {
      const selectedGrade = gradeOptions.find(g => g.grade === value);
      if (selectedGrade) {
        setFormData(prev => ({ ...prev, gradePoint: selectedGrade.point.toString() }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required';
    }

    if (!formData.credits || parseFloat(formData.credits) <= 0) {
      newErrors.credits = 'Valid credits required';
    }

    if (!formData.grade) {
      newErrors.grade = 'Grade is required';
    }

    if (!formData.gradePoint || parseFloat(formData.gradePoint) < 0 || parseFloat(formData.gradePoint) > 10) {
      newErrors.gradePoint = 'Valid grade point required (0-10)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        name: formData.name.trim(),
        credits: parseFloat(formData.credits),
        grade: formData.grade,
        gradePoint: parseFloat(formData.gradePoint),
      });
    }
  };

  const handleClose = () => {
    setFormData({ name: '', credits: '', grade: '', gradePoint: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-black mb-6">Add New Subject</h2>

          <form onSubmit={handleSubmit}>
            {/* Subject Name */}
            <div className="mb-5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black`}
                placeholder="e.g., Data Structures"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Credits */}
            <div className="mb-5">
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-2">
                Credits
              </label>
              <input
                type="number"
                id="credits"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                step="0.5"
                min="0"
                className={`w-full px-4 py-3 border ${errors.credits ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black`}
                placeholder="e.g., 4"
              />
              {errors.credits && <p className="text-red-500 text-xs mt-1">{errors.credits}</p>}
            </div>

            {/* Grade */}
            <div className="mb-5">
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.grade ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black`}
              >
                <option value="">Select Grade</option>
                {gradeOptions.map(option => (
                  <option key={option.grade} value={option.grade}>
                    {option.grade} - {option.point} GP
                  </option>
                ))}
              </select>
              {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
            </div>

            {/* Grade Point */}
            <div className="mb-6">
              <label htmlFor="gradePoint" className="block text-sm font-medium text-gray-700 mb-2">
                Grade Point
              </label>
              <input
                type="number"
                id="gradePoint"
                name="gradePoint"
                value={formData.gradePoint}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="10"
                className={`w-full px-4 py-3 border ${errors.gradePoint ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black`}
                placeholder="e.g., 9.0"
              />
              {errors.gradePoint && <p className="text-red-500 text-xs mt-1">{errors.gradePoint}</p>}
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Subject'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddSubjectModal;
