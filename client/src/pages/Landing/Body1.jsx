import React from 'react'

import CalculatorLogo from '../../assets/Calculator-logo.gif'
import BarLogo from '../../assets/barGraph.gif'
import DownloadLogo from '../../assets/download.gif'
const Body1 = () => {
  return (
    <div >
        <div className='mt-28 mb-28'>
            <h1 className='text-6xl  font-extrabold'>Track Your CGPA with </h1>
            <h1 className='text-6xl  font-extrabold mt-4'>Ease</h1>
            <h2 className='mt-6 text-gray-500 text-xl'>Simple, accurate, and beautifully designed for students.</h2>
            <button className="px-4 py-2 bg-black text-white rounded mt-8">Start Calculating</button>
        </div>
        <hr className='border border-gray-400 animate-pulse'/>

        <div className='mt-20 mb-30'>
            <h1 className='text-4xl  font-extrabold'>Why use our CGPA Calculator?</h1>
            <h2 className='mt-6 text-gray-500 '>Our tool is designed to provide you with a seamless and insightful experience, helping you stay <br/> on top of your academic goals.</h2>

            <div className=' flex justify-center gap-10 mt-20 mb-20'>
                <div className='flex-row border border-gray-300 p-6 rounded-xl shadow-sm
                                hover:scale-105 hover:shadow-xl transition-shadow duration-900 bg-white'>
                    <img src={CalculatorLogo} alt="Logo Animation" className='w-8 h-8 mt-2'/>
                    <br/>
                    <div className='flex-row place-items-start mt-2'>
                        <h2 className='font-extrabold'>Progress Charts</h2>
                        <p>Get your CGPA calculated in real-</p> 
                        <p>time as you input your grades and </p> 
                        <p>credits.</p>
                    </div>
                    
                </div>

                <div className='flex-row border border-gray-300 p-6 rounded-xl shadow-sm
                                hover:scale-105 hover:shadow-xl transition-shadow duration-900 bg-white'>
                    <img src={BarLogo} alt="Logo Animation" className='w-12 h-12'/>
                    <br/>
                    <div className='flex-row place-items-start'>
                        <h2 className='font-extrabold'>Instant Calculation</h2>
                        <p>Visualize your academic</p> 
                        <p>performance over time with intuitive </p> 
                        <p>and clear charts.</p>
                    </div>
                    
                </div>

                <div className='flex-row border border-gray-300 p-6 rounded-xl shadow-sm
                                hover:scale-105 hover:shadow-xl transition-shadow duration-900 bg-white'>
                    <img src={DownloadLogo} alt="Logo Animation" className='w-8 h-8'/>
                    <br/>
                    <div className='flex-row place-items-start'>
                        <h2 className='font-extrabold'>Export Results</h2>
                        <p>Easily save, share, or print your</p> 
                        <p>CGPA results for your records.</p> 
                    </div>
                    
                </div>
                
            </div>
        </div>
        <hr className='border border-gray-400 animate-pulse'/>
    </div>
  )
}

export default Body1