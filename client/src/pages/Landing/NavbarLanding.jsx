import React from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/Logo.png'

const NavbarLanding = () => {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate('/login')
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center cursor-pointer' onClick={() => navigate('/')}>
            <img src={Logo} alt="CGPA Calculator" className='h-10 w-10'/>
            <span className='ml-2 text-xl font-semibold tracking-tight text-gray-900'>CGPA Calculator</span>
          </div>
          
          {/* Navigation Items */}
          <div className='flex items-center gap-8'>
            <button 
              onClick={() => scrollToSection('home')}
              className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200'
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200'
            >
              Features
            </button>
            <button 
              onClick={handleLoginClick}
              className='px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-white hover:text-gray-900 hover:ring-2 hover:ring-gray-900 transition-all duration-300 transform hover:scale-105'
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavbarLanding