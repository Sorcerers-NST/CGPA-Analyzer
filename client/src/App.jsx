import './App.css'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing.jsx'
import Login from './pages/Auth/Login.jsx'
import Signup from './pages/Auth/Signup.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
