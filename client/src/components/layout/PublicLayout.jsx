import PublicNavbar from './PublicNavbar';

const PublicLayout = ({ children, showNavbar = true }) => {
  return (
    <div className="min-h-screen bg-white">
      {showNavbar && <PublicNavbar />}
      <main>
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;
