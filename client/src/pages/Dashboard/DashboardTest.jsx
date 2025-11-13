import { useAuth } from '../../contexts/AuthContext';

const DashboardTest = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold">Dashboard Test</h1>
      <p className="mt-4">User: {user?.username || 'Not logged in'}</p>
      <p className="mt-2">Email: {user?.email || 'N/A'}</p>
    </div>
  );
};

export default DashboardTest;
