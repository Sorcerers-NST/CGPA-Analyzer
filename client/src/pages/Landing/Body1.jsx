import React from 'react'

import CalculatorLogo from '../../assets/Calculator-logo.gif'
import BarLogo from '../../assets/barGraph.gif'
import DownloadLogo from '../../assets/download.gif'

const Body1 = () => {
  return (
    <div className='bg-white'>
      <section className='max-w-6xl mx-auto px-6 py-32 text-center'>
        <div className='animate-fade-in'>
          <h1 className='text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight'>
            Track Your CGPA with
          </h1>
          <h1 className='text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight mt-2'>
            Ease
          </h1>
          <p className='mt-8 text-xl text-gray-600 max-w-2xl mx-auto'>
            Simple, accurate, and beautifully designed for students.
          </p>
          <button className='mt-10 px-8 py-4 bg-gray-900 text-white text-base font-medium rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'>
            Start Calculating
          </button>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-6'>
        <div className='border-t border-gray-200'></div>
      </div>

      {/* Features Section */}
      <section className='max-w-6xl mx-auto px-6 py-24'>
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
    </div>
  )
}

export default Body1