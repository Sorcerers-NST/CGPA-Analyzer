import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../assets/Logo.png'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [collegeId, setCollegeId] = useState('')
  const [colleges, setColleges] = useState([])
  const [addingCollege, setAddingCollege] = useState(false)
  const [newCollegeName, setNewCollegeName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/colleges')
        const text = await res.text()
        const data = text ? JSON.parse(text) : null
        if (data && data.colleges) setColleges(data.colleges)
      } catch (err) {
        console.error('Failed to load colleges', err)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
  try {
      let finalCollegeId = collegeId
      // if user chose to add a new college, create it first
      if (addingCollege || collegeId === 'add_new') {
        if (!newCollegeName || !newCollegeName.trim()) {
          setError('Please enter your college name')
          setLoading(false)
          return
        }
        const resp = await fetch('/api/colleges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCollegeName.trim() })
        })
        const text = await resp.text()
        const created = text ? JSON.parse(text) : null
        if (!resp.ok) {
          console.error('Create college failed', resp.status, created)
          // if college already exists, API returns 409 with existing college info; accept it and continue
          if (resp.status === 409 && created?.college?.id) {
            finalCollegeId = created.college.id
          } else {
            const serverMsg = created?.error || (text || '')
            setError(`Failed to create college (status ${resp.status})${serverMsg ? `: ${serverMsg}` : ''}`)
            setLoading(false)
            return
          }
        } else {
          finalCollegeId = created?.college?.id
        }
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, collegeId: finalCollegeId })
      })
      const text = await res.text()
      const data = text ? JSON.parse(text) : null
      if (!res.ok) {
        setError(data?.error || 'Registration failed')
        setLoading(false)
        return
      }

      navigate('/login')
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <img src={Logo} alt="CGPA Calculator" className="h-12 w-12 mr-3" />
            <h1 className="text-2xl font-semibold text-center text-gray-900">
              Create account
            </h1>
          </div>

          {error && (
            <div className="text-red-600 text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
              <select value={collegeId} onChange={e => {
                const val = e.target.value
                if (val === 'add_new') {
                  setAddingCollege(true)
                  setCollegeId('add_new')
                } else {
                  setAddingCollege(false)
                  setCollegeId(val)
                }
              }} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg">
                <option value="">Select your college</option>
                {colleges.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
                <option value="add_new">My college isn't listed</option>
              </select>

              {addingCollege && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add your college</label>
                  <input value={newCollegeName} onChange={e => setNewCollegeName(e.target.value)} placeholder="Enter college name" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition">
              {loading ? 'Creating...' : 'Sign up'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link to="/login" className="text-black font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
