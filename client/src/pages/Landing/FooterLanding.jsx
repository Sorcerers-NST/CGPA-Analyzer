import React from 'react'

const FooterLanding = () => {
  return (
    <div className='mt-10'>
        <ul className='flex gap-12 justify-center'>
            <li className='text-gray-500 font-bold'>Home</li>
            <li className='text-gray-500 font-bold'>About</li>
            <li className='text-gray-500 font-bold'>Contact</li>
            <li className='text-gray-500 font-bold'>Privacy Policy</li>
        </ul>
        <br/>
        <p className='text-gray-500'>&copy; 2024 CGPA Calculator. All Rights Reserved.</p>
    </div>
  )
}

export default FooterLanding