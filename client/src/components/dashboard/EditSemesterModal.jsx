import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const EditSemesterModal = ({ isOpen, onClose, onSubmit, semester, isLoading }) => {
  const [formData, setFormData] = useState({
    semesterNumber: '',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState({});

  // Populate form when semester changes
  useEffect(() => {
    if (semester) {
      setFormData({
        semesterNumber: semester.semesterNumber?.toString() || '',
        startDate: semester.startDate ? new Date(semester.startDate).toISOString().split('T')[0] : '',
        endDate: semester.endDate ? new Date(semester.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [semester]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.semesterNumber || parseInt(formData.semesterNumber) <= 0) {
      newErrors.semesterNumber = 'Valid semester number is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const updateData = {
        semesterNumber: parseInt(formData.semesterNumber),
      };

      // Only include dates if they are provided
      if (formData.startDate) {
        updateData.startDate = formData.startDate;
      }
      if (formData.endDate) {
        updateData.endDate = formData.endDate;
      }

      onSubmit(updateData);
    }
  };

  const handleClose = () => {
    setFormData({ semesterNumber: '', startDate: '', endDate: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen || !semester) return null;

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
          <h2 className="text-2xl font-bold text-black mb-6">Edit Semester</h2>

          <form onSubmit={handleSubmit}>
            {/* Semester Number */}
            <div className="mb-5">
              <label htmlFor="semesterNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Semester Number *
              </label>
              <input
                type="number"
                id="semesterNumber"
                name="semesterNumber"
                value={formData.semesterNumber}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-3 border ${errors.semesterNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black`}
                placeholder="e.g., 1"
              />
              {errors.semesterNumber && <p className="text-red-500 text-xs mt-1">{errors.semesterNumber}</p>}
            </div>

            {/* Start Date */}
            <div className="mb-5">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date (Optional)
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black`}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div className="mb-6">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black`}
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
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
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditSemesterModal;
