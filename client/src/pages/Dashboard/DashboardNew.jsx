/**
 * Dashboard - cal.com style
 * 
 * Clean, minimalist dashboard with generous white space
 * Focus on typography hierarchy and subtle interactions
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiTrendingUp, FiBook, FiAward } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { getAllSemesters, createSemester } from '../../services/semesterApi';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Skeleton, { SkeletonCard } from '../../components/ui/Skeleton';
import { ToastContainer } from '../../components/ui/Toast';

const DashboardNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cgpa, setCgpa] = useState(null);
  const [semesterNumber, setSemesterNumber] = useState('');
  const [creating, setCreating] = useState(false);
  
  const addSemesterModal = useModal();
  const toast = useToast();

  // Fetch semesters on mount
  useEffect(() => {
    fetchSemesters();
  }, []);

  // Listen for command palette events
  useEffect(() => {
    const handleOpenAddSemester = () => addSemesterModal.open();
    window.addEventListener('open-add-semester', handleOpenAddSemester);
    return () => window.removeEventListener('open-add-semester', handleOpenAddSemester);
  }, []);

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      const response = await getAllSemesters();
      const data = response.data || [];
      setSemesters(data);
      calculateCGPA(data);
    } catch (error) {
      toast.error('Failed to load semesters');
    } finally {
      setLoading(false);
    }
  };

  const calculateCGPA = (semestersData) => {
    let totalCredits = 0;
    let weightedSum = 0;

    semestersData.forEach(sem => {
      if (sem.subjects) {
        sem.subjects.forEach(subject => {
          totalCredits += subject.credits;
          weightedSum += subject.gradePoint * subject.credits;
        });
      }
    });

    const calculatedCGPA = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : null;
    setCgpa(calculatedCGPA);
  };

  const handleCreateSemester = async (e) => {
    e.preventDefault();
    
    if (!semesterNumber) {
      toast.error('Please enter a semester number');
      return;
    }

    try {
      setCreating(true);
      await createSemester({ semesterNumber: parseInt(semesterNumber) });
      toast.success('Semester created successfully');
      addSemesterModal.close();
      setSemesterNumber('');
      fetchSemesters();
    } catch (error) {
      toast.error(error.message || 'Failed to create semester');
    } finally {
      setCreating(false);
    }
  };

  // Calculate stats
  const stats = {
    totalSemesters: semesters.length,
    totalCredits: semesters.reduce((sum, sem) => 
      sum + (sem.subjects?.reduce((s, sub) => s + sub.credits, 0) || 0), 0
    ),
    totalSubjects: semesters.reduce((sum, sem) => 
      sum + (sem.subjects?.length || 0), 0
    )
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-2">
              Welcome back, {user?.username}
            </h1>
            <p className="text-gray-600">
              Here's your academic overview for this semester.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* CGPA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {loading ? (
            <SkeletonCard />
          ) : (
            <Card className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Current CGPA</p>
                  <h2 className="text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                    {cgpa || '—'}
                  </h2>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <FiBook className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{stats.totalSemesters} semesters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiAward className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{stats.totalSubjects} subjects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiTrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{stats.totalCredits} credits</span>
                    </div>
                  </div>
                </div>
                
                {/* Performance Badge */}
                {cgpa && (
                  <Badge
                    variant={cgpa >= 9 ? 'success' : cgpa >= 8 ? 'primary' : 'default'}
                    size="lg"
                  >
                    {cgpa >= 9 ? 'Outstanding' : cgpa >= 8 ? 'Excellent' : 'Good'}
                  </Badge>
                )}
              </div>
            </Card>
          )}
        </motion.div>

        {/* Semesters Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Your Semesters
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your academic records
              </p>
            </div>
            <Button
              onClick={addSemesterModal.open}
              icon={<FiPlus className="w-4 h-4" />}
            >
              Add Semester
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : semesters.length === 0 ? (
            <EmptyState onAdd={addSemesterModal.open} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {semesters.map((semester, index) => (
                <SemesterCard
                  key={semester.id}
                  semester={semester}
                  index={index}
                  onClick={() => navigate(`/semester/${semester.id}`)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Semester Modal */}
      <Modal
        isOpen={addSemesterModal.isOpen}
        onClose={addSemesterModal.close}
        title="Add New Semester"
        footer={
          <>
            <Button variant="ghost" onClick={addSemesterModal.close} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreateSemester} loading={creating}>
              Create Semester
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSemester}>
          <Input
            label="Semester Number"
            type="number"
            value={semesterNumber}
            onChange={(e) => setSemesterNumber(e.target.value)}
            placeholder="e.g., 1, 2, 3..."
            required
            min="1"
            autoFocus
          />
        </form>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

// Semester Card Component
const SemesterCard = ({ semester, index, onClick }) => {
  const sgpa = semester.sgpa || 0;
  const subjectCount = semester.subjects?.length || 0;
  const totalCredits = semester.subjects?.reduce((sum, sub) => sum + sub.credits, 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card onClick={onClick} className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{semester.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {subjectCount} {subjectCount === 1 ? 'subject' : 'subjects'}
            </p>
          </div>
          <Badge variant="primary">{sgpa.toFixed(2)}</Badge>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Credits</span>
            <span className="font-medium text-gray-900">{totalCredits}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({ onAdd }) => (
  <Card className="p-12 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FiBook className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No semesters yet
    </h3>
    <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
      Start tracking your academic performance by adding your first semester.
    </p>
    <Button onClick={onAdd} icon={<FiPlus className="w-4 h-4" />}>
      Add Your First Semester
    </Button>
  </Card>
);

export default DashboardNew;
