import React from 'react'
import { Link } from 'react-router-dom'

const FooterLanding = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-6xl mx-auto px-6 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-12'>
          {/* Brand Column */}
          <div>
            <h3 className='text-2xl font-bold mb-4'>CGPA Calculator</h3>
            <p className='text-gray-400 text-sm leading-relaxed mb-6'>
              A simple and effective tool to help students track their academic progress and achieve their goals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='font-semibold text-lg mb-4'>Quick Links</h4>
            <ul className='space-y-3'>
              <li>
                <a href='#home' className='text-gray-400 hover:text-white transition-colors text-sm'>
                  Home
                </a>
              </li>
              <li>
                <a href='#features' className='text-gray-400 hover:text-white transition-colors text-sm'>
                  Features
                </a>
              </li>
              <li>
                <Link to='/login' className='text-gray-400 hover:text-white transition-colors text-sm'>
                  Login
                </Link>
              </li>
              <li>
                <Link to='/signup' className='text-gray-400 hover:text-white transition-colors text-sm'>
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className='font-semibold text-lg mb-4'>Support</h4>
            <ul className='space-y-3'>
              <li>
                <a href='mailto:support@cgpacalculator.com' className='text-gray-400 hover:text-white transition-colors text-sm'>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white transition-colors text-sm'>
                  Help Center
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white transition-colors text-sm'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white transition-colors text-sm'>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-800 pt-8'>
          <div className='text-center'>
            <p className='text-sm text-gray-400'>
              &copy; {currentYear} CGPA Calculator. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterLanding