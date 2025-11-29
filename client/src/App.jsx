import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home.jsx'
import Landing from './pages/Landing/Landing.jsx'
import Login from './pages/Auth/Login.jsx'
import Signup from './pages/Auth/Signup.jsx'
import DashboardNew from './pages/Dashboard/DashboardNew.jsx'
import CompleteProfile from './pages/Auth/CompleteProfile.jsx'
import SemesterView from './pages/Semester/SemesterView.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Settings from './pages/Settings/Settings.jsx'
import Analytics from './pages/Analytics/Analytics.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import PublicLayout from './components/layout/PublicLayout.jsx'
import HomeRedirect from './components/HomeRedirect.jsx'

function App() {
  return (
    <AuthProvider>
      <div className="w-full min-h-screen overflow-x-hidden">
        <Routes>
          <Route path="/" element={
            <HomeRedirect>
              <PublicLayout>
                <Home />
              </PublicLayout>
            </HomeRedirect>
          } />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardNew />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/complete-profile" 
            element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/semester/:id" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SemesterView />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
