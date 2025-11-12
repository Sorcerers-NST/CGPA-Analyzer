import { Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing/Landing.jsx'
import Login from './pages/Auth/Login.jsx'
import Signup from './pages/Auth/Signup.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import CompleteProfile from './pages/Auth/CompleteProfile.jsx'
import SemesterView from './pages/Semester/SemesterView.jsx'

function App() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/semester/:id" element={<SemesterView />} />
      </Routes>
    </div>
  )
}

export default App
