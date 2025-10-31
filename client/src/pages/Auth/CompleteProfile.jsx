import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/Logo.png'

const CompleteProfile = () => {
  const [colleges, setColleges] = useState([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/colleges')
        const text = await res.text()
        const data = text ? JSON.parse(text) : null
        if (data?.colleges) setColleges(data.colleges)
      } catch (err) {
        console.error('Failed to load colleges', err)
      }
    })()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!selected) {
      setError('Please choose your college')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/users/me/college', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ collegeId: selected })
      })
      const text = await res.text()
      const data = text ? JSON.parse(text) : null
      if (!res.ok) {
        setError(data?.error || 'Unable to update college')
        setLoading(false)
        return
      }
      // success: navigate home
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Network error')
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
            <h1 className="text-2xl font-semibold text-center text-gray-900">Complete your profile</h1>
          </div>

          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
              <select value={selected} onChange={e => setSelected(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg">
                <option value="">Select your college</option>
                {colleges.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition">
              {loading ? 'Saving...' : 'Save and continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfile
