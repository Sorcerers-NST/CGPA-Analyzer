import { useEffect, useState } from 'react';
import { getAllSemesters } from '../../services/semesterApi';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import DashboardHero from '../../components/dashboard/DashboardHero';
import PerformanceAnalytics from '../../components/dashboard/PerformanceAnalytics';
import SemesterComparison from '../../components/dashboard/SemesterComparison';
import GradeDistribution from '../../components/dashboard/GradeDistribution';
import { ToastContainer } from '../../components/ui/Toast';

const Analytics = () => {
  const { user } = useAuth();
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      const response = await getAllSemesters();
      const data = response.data && Array.isArray(response.data) ? response.data : [];
      setSemesters(data);
    } catch (error) {
      toast.error('Failed to load semesters data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardHero 
        title="Performance Analytics" 
        subtitle="Comprehensive breakdown of your academic performance across all semesters."
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            <PerformanceAnalytics semesters={semesters} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GradeDistribution semesters={semesters} />
              <SemesterComparison semesters={semesters} />
            </div>
          </>
        )}
      </div>

      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default Analytics;
