import React, { useEffect, useState } from 'react'
import Logo from '../../assets/Logo.png'
import { Link } from 'react-router-dom'

const NavbarLanding = () => {
  const [user, setUser] = useState(null);

  const needsProfileCompletion = user && user.college && user.college.name === 'Default College'

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        setUser(null);
      }
    })();
    return () => { mounted = false };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout error', err);
    }
    setUser(null);
  };

  return (
    <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <img src={Logo} alt="CGPA Calculator" className='h-10 w-10'/>
            <span className='ml-2 text-xl font-semibold tracking-tight text-gray-900'>CGPA Calculator</span>
          </div>

          <div className='flex items-center gap-8'>
            <a href="#home" className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200'>
              Home
            </a>
            <a href="#about" className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200'>
              About
            </a>
            {user ? (
              <button onClick={handleLogout} className='px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-white hover:text-gray-900 hover:ring-2 hover:ring-gray-900 transition-all duration-300 transform hover:scale-105'>
                Logout
              </button>
            ) : (
              <Link to="/login" className='px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-white hover:text-gray-900 hover:ring-2 hover:ring-gray-900 transition-all duration-300 transform hover:scale-105'>
                Login
              </Link>
            )}
          </div>
        </div>
        {needsProfileCompletion && (
          <div className='bg-yellow-50 border-t border-b border-yellow-200 text-yellow-900 py-3 px-6 text-center'>
            It looks like you signed up with Google. Please <Link to="/complete-profile" className='underline font-medium'>complete your profile</Link> by choosing your college.
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavbarLanding