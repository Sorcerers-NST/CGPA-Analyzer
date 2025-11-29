import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardHero from '../../components/dashboard/DashboardHero';

const Analytics = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <DashboardHero 
        title="Performance Analytics" 
        subtitle="Comprehensive breakdown of your academic performance across all semesters."
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Analytics content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
