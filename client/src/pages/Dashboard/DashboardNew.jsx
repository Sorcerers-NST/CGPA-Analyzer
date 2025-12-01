/**
 * Dashboard - cal.com style
 * 
 * Clean, minimalist dashboard with generous white space
 * Focus on typography hierarchy and subtle interactions
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllSemesters, createSemester, deleteSemester, updateSemester } from '../../services/semesterApi';
import { useModal } from '../../hooks/useModal';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

// Imported Components
import DashboardHero from '../../components/dashboard/DashboardHero';
import DashboardStats from '../../components/dashboard/DashboardStats';
import DashboardSemesters from '../../components/dashboard/DashboardSemesters';
import EditSemesterModal from '../../components/dashboard/EditSemesterModal';

const DashboardNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cgpa, setCgpa] = useState(null);
  const [semesterNumber, setSemesterNumber] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const addSemesterModal = useModal();

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
      setError(null);
      const response = await getAllSemesters();
      const data = response.data || [];
      
      // Calculate SGPA for each semester
      const semestersWithSGPA = data.map(semester => {
        const subjects = semester.subjects || [];
        
        // Filter subjects that have gradePoint
        const completedSubjects = subjects.filter(
          subject => subject.gradePoint !== null && subject.gradePoint !== undefined
        );
        
        if (completedSubjects.length === 0) {
          return { ...semester, sgpa: 0 };
        }
        
        // Calculate SGPA
        let weightedSum = 0;
        let totalCredits = 0;
        
        completedSubjects.forEach(subject => {
          weightedSum += subject.gradePoint * subject.credits;
          totalCredits += subject.credits;
        });
        
        const sgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;
        
        return { ...semester, sgpa };
      });
      
      setSemesters(semestersWithSGPA);
      calculateCGPA(semestersWithSGPA);
    } catch (error) {
      setError('Failed to load semesters');
      console.error('Failed to load semesters:', error);
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
      setError('Please enter a semester number');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await createSemester({ semesterNumber: parseInt(semesterNumber) });
      addSemesterModal.close();
      setSemesterNumber('');
      fetchSemesters();
    } catch (error) {
      setError(error.message || 'Failed to create semester');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSemester = async (semesterId) => {
    try {
      setError(null);
      await deleteSemester(semesterId);
      // Refresh semesters after successful deletion
      fetchSemesters();
    } catch (error) {
      setError(error.message || 'Failed to delete semester');
      console.error('Failed to delete semester:', error);
    }
  };

  const handleEditSemester = (semester) => {
    setSelectedSemester(semester);
    setIsEditModalOpen(true);
  };

  const handleUpdateSemester = async (updateData) => {
    if (!selectedSemester) return;

    try {
      setUpdating(true);
      setError(null);
      await updateSemester(selectedSemester.id, updateData);
      setIsEditModalOpen(false);
      setSelectedSemester(null);
      fetchSemesters();
    } catch (error) {
      setError(error.message || 'Failed to update semester');
      console.error('Failed to update semester:', error);
    } finally {
      setUpdating(false);
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
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

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
          onDelete={handleDeleteSemester}
          onEdit={handleEditSemester}
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

      {/* Edit Semester Modal */}
      <EditSemesterModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSemester(null);
        }}
        onSubmit={handleUpdateSemester}
        semester={selectedSemester}
        isLoading={updating}
      />
    </div>
  );
};

export default DashboardNew;

