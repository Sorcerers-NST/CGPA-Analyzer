import React from 'react'

const FooterLanding = () => {
  return (
    <footer className='bg-white border-t border-gray-200'>
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <div className='flex flex-wrap items-center justify-center gap-8 mb-8'>
          <a href="#home" className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200'>
            Home
          </a>
          <a href="#about" className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200'>
            About
          </a>
          <a href="#contact" className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200'>
            Contact
          </a>
          <a href="#privacy" className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200'>
            Privacy Policy
          </a>
        </div>
        
        
        <div className='text-center'>
          <p className='text-sm text-gray-500'>
            &copy; 2024 CGPA Calculator. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default FooterLanding