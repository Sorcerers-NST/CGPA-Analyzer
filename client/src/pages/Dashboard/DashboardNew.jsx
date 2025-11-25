/**
 * Dashboard - cal.com style
 * 
 * Clean, minimalist dashboard with generous white space
 * Focus on typography hierarchy and subtle interactions
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllSemesters, createSemester } from '../../services/semesterApi';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { ToastContainer } from '../../components/ui/Toast';

// Imported Components
import DashboardHero from '../../components/dashboard/DashboardHero';
import DashboardStats from '../../components/dashboard/DashboardStats';
import DashboardSemesters from '../../components/dashboard/DashboardSemesters';

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
      <DashboardHero username={user?.username} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* CGPA Card */}
        <DashboardStats 
          loading={loading} 
          cgpa={cgpa} 
          stats={stats} 
        />

        {/* Semesters Section */}
        <DashboardSemesters 
          loading={loading}
          semesters={semesters}
          onAdd={addSemesterModal.open}
          onSemesterClick={(id) => navigate(`/semester/${id}`)}
        />
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

export default DashboardNew;

