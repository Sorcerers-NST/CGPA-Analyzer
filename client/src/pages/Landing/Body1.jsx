import React from 'react'
import { useNavigate } from 'react-router-dom'

import CalculatorLogo from '../../assets/Calculator-logo.gif'
import BarLogo from '../../assets/barGraph.gif'
import DownloadLogo from '../../assets/download.gif'

const Body1 = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    // Check if user is logged in (you can add proper auth check later)
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn) {
      navigate('/dashboard')
    } else {
      navigate('/signup')
    }
  }

  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <section id='home' className='relative overflow-hidden bg-gradient-to-b from-gray-50 to-white'>
        <div className='max-w-6xl mx-auto px-6 py-32 text-center'>
          <div className='animate-fade-in'>
            <h1 className='text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight'>
              Track Your CGPA with
            </h1>
            <h1 className='text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent leading-tight mt-2'>
              Precision & Ease
            </h1>
            <p className='mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
              A modern CGPA calculator designed for students. Track your grades, visualize your progress, and stay organized throughout your academic journey.
            </p>
            
            <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
              <button 
                onClick={handleGetStarted}
                className='px-8 py-4 bg-gray-900 text-white text-base font-medium rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
              >
                Get Started Free →
              </button>
              <button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className='px-8 py-4 bg-white text-gray-900 text-base font-medium rounded-full border-2 border-gray-200 hover:border-gray-900 hover:scale-105 transition-all duration-300'
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-6'>
        <div className='border-t border-gray-200'></div>
      </div>

      {/* Features Section */}
      <section id='features' className='max-w-6xl mx-auto px-6 py-24'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold tracking-tight text-gray-900'>
            Why use our CGPA Calculator?
          </h2>
          <p className='mt-6 text-lg text-gray-600 max-w-3xl mx-auto'>
            Our tool is designed to provide you with a seamless and insightful experience, helping you stay on top of your academic goals.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16'>
          
          <div className='group bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:scale-105 transition-all duration-300'>
            <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm mb-6'>
              <img src={CalculatorLogo} alt="Calculator Icon" className='w-8 h-8'/>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>
              Instant Calculation
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Get your CGPA calculated in real-time as you input your grades and credits.
            </p>
          </div>

          
          <div className='group bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:scale-105 transition-all duration-300'>
            <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm mb-6'>
              <img src={BarLogo} alt="Chart Icon" className='w-10 h-10'/>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>
              Progress Charts
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Visualize your academic performance over time with intuitive and clear charts.
            </p>
          </div>

          
          <div className='group bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:scale-105 transition-all duration-300'>
            <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm mb-6'>
              <img src={DownloadLogo} alt="Download Icon" className='w-8 h-8'/>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>
              Export Results
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Easily save, share, or print your CGPA results for your records.
            </p>
          </div>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-6'>
        <div className='border-t border-gray-200'></div>
      </div>

      {/* How It Works Section */}
      <section className='max-w-6xl mx-auto px-6 py-24'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold tracking-tight text-gray-900'>
            Getting Started is Simple
          </h2>
          <p className='mt-6 text-lg text-gray-600 max-w-3xl mx-auto'>
            Three easy steps to begin tracking your academic performance
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16'>
          <div className='text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full text-2xl font-bold mb-6'>
              1
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>Create Your Account</h3>
            <p className='text-gray-600 leading-relaxed'>
              Sign up with your email in seconds. It's completely free with no hidden charges.
            </p>
          </div>

          <div className='text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full text-2xl font-bold mb-6'>
              2
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>Add Your Courses</h3>
            <p className='text-gray-600 leading-relaxed'>
              Enter your courses, grades, and credit hours for each semester you want to track.
            </p>
          </div>

          <div className='text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full text-2xl font-bold mb-6'>
              3
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>Monitor Your Progress</h3>
            <p className='text-gray-600 leading-relaxed'>
              View your CGPA instantly, track trends over semesters, and export your results anytime.
            </p>
          </div>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-6'>
        <div className='border-t border-gray-200'></div>
      </div>

      {/* Benefits Section */}
      <section className='max-w-6xl mx-auto px-6 py-24'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          <div>
            <h2 className='text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6'>
              Built for Students, By Students
            </h2>
            <p className='text-lg text-gray-600 mb-8 leading-relaxed'>
              We understand the importance of tracking your academic progress. Our calculator is designed to be intuitive, accurate, and helpful throughout your college journey.
            </p>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3'>
                <svg className='w-6 h-6 text-gray-900 flex-shrink-0 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                <span className='text-gray-600'>No complex formulas - just enter your grades and credits</span>
              </li>
              <li className='flex items-start gap-3'>
                <svg className='w-6 h-6 text-gray-900 flex-shrink-0 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                <span className='text-gray-600'>Track multiple semesters and see your overall progress</span>
              </li>
              <li className='flex items-start gap-3'>
                <svg className='w-6 h-6 text-gray-900 flex-shrink-0 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                <span className='text-gray-600'>Clean interface that works on any device</span>
              </li>
              <li className='flex items-start gap-3'>
                <svg className='w-6 h-6 text-gray-900 flex-shrink-0 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                <span className='text-gray-600'>Your data is secure and private</span>
              </li>
            </ul>
          </div>
          
          <div className='bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white'>
            <h3 className='text-2xl font-bold mb-4'>Why Track Your CGPA?</h3>
            <p className='text-gray-300 mb-6 leading-relaxed'>
              Keeping track of your CGPA helps you stay aware of your academic standing, plan for improvement, and meet graduation requirements.
            </p>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-gray-200'>Monitor your academic performance over time</span>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-gray-200'>Set goals and track progress towards them</span>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-gray-200'>Plan your course load strategically</span>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-gray-200'>Share results with advisors or for applications</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-6'>
        <div className='border-t border-gray-200'></div>
      </div>

      {/* CTA Section */}
      <section className='max-w-6xl mx-auto px-6 py-24'>
        <div className='bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>
            Ready to Get Started?
          </h2>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto mb-10'>
            Start tracking your CGPA today. It's free, simple, and takes less than a minute to set up.
          </p>
          <button 
            onClick={handleGetStarted}
            className='px-10 py-4 bg-white text-gray-900 text-base font-medium rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg'
          >
            Create Free Account →
          </button>
          <p className='text-sm text-gray-400 mt-6'>
            No credit card required • Free to use • Takes 30 seconds
          </p>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-6'>
        <div className='border-t border-gray-200'></div>
      </div>
    </div>
  )
}

export default Body1