import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSemesterById, calculateSemesterCGPA } from '../../services/semesterApi';
import { createSubject, updateSubject, deleteSubject } from '../../services/subjectApi';
import SemesterHeader from '../../components/semester/SemesterHeader';
import SGPABox from '../../components/semester/SGPABox';
import SubjectCard from '../../components/semester/SubjectCard';
import AddSubjectModal from '../../components/semester/AddSubjectModal';
import EditSubjectModal from '../../components/semester/EditSubjectModal';

const SemesterView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [semester, setSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [sgpa, setSgpa] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(null);
  
  // Loading states for actions
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSemesterData();
  }, [id]);

  // Listen for command palette "Add Subject" event
  useEffect(() => {
    const handleAddSubjectEvent = () => {
      handleAddSubject();
    };

    window.addEventListener('open-add-subject', handleAddSubjectEvent);
    return () => window.removeEventListener('open-add-subject', handleAddSubjectEvent);
  }, []);

  const fetchSemesterData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch semester details (includes subjects)
      const semesterResponse = await getSemesterById(id);
      const semesterData = semesterResponse.data;
      
      setSemester(semesterData);
      setSubjects(semesterData.subjects || []);
      
      // Calculate SGPA
      await calculateSGPA();
    } catch (err) {
      setError(err.message || 'Failed to load semester data');
      console.error('Error fetching semester:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSGPA = async () => {
    try {
      const cgpaResponse = await calculateSemesterCGPA(id);
      setSgpa(cgpaResponse.data?.sgpa || 0);
    } catch (err) {
      console.error('Error calculating SGPA:', err);
    }
  };

  // Subject handlers
  const handleAddSubject = () => {
    setShowAddModal(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setShowEditModal(true);
  };

  const handleDeleteSubject = (subject) => {
    setDeletingSubject(subject);
    setShowDeleteConfirm(true);
  };

  // Submit handlers
  const handleSubmitAdd = async (subjectData) => {
    try {
      setIsAdding(true);
      await createSubject({
        ...subjectData,
        semesterId: id,
      });
      
      setShowAddModal(false);
      await fetchSemesterData(); // Refresh
    } catch (err) {
      alert(err.message || 'Failed to add subject');
      console.error('Error adding subject:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmitEdit = async (subjectData) => {
    try {
      setIsEditing(true);
      await updateSubject(editingSubject.id, subjectData);
      
      setShowEditModal(false);
      setEditingSubject(null);
      await fetchSemesterData(); // Refresh
    } catch (err) {
      alert(err.message || 'Failed to update subject');
      console.error('Error updating subject:', err);
    } finally {
      setIsEditing(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingSubject) return;
    
    try {
      setIsDeleting(true);
      await deleteSubject(deletingSubject.id);
      
      setShowDeleteConfirm(false);
      setDeletingSubject(null);
      await fetchSemesterData(); // Refresh
    } catch (err) {
      alert(err.message || 'Failed to delete subject');
      console.error('Error deleting subject:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading semester...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !semester) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">Error Loading Semester</h2>
            <p className="text-gray-600 mb-6">{error || 'Semester not found'}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md"
            >
              Back to Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Semester Header */}
        <SemesterHeader
          semesterNumber={semester.semesterNumber}
          onAddSubject={handleAddSubject}
        />

        {/* SGPA Summary Card */}
        <SGPABox
          sgpa={sgpa}
          subjects={subjects}
          lastUpdated={semester.updatedAt}
        />

        {/* Subjects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-black">Subjects</h2>
          </div>

          {/* Empty State */}
          {subjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                No subjects yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Add subjects to this semester to track your grades and calculate SGPA.
              </p>
              <button
                onClick={handleAddSubject}
                className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add Your First Subject</span>
              </button>
            </motion.div>
          )}

          {/* Subject Cards */}
          {subjects.length > 0 && (
            <div className="space-y-4">
              {subjects.map((subject, index) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  index={index}
                  onEdit={handleEditSubject}
                  onDelete={handleDeleteSubject}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2025 CGPA Analyzer. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddSubjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitAdd}
        isLoading={isAdding}
      />

      <EditSubjectModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingSubject(null);
        }}
        onSubmit={handleSubmitEdit}
        subject={editingSubject}
        isLoading={isEditing}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => !isDeleting && setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">Delete Subject?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{deletingSubject?.name}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingSubject(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 shadow-md"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SemesterView;
