import React from 'react'

const NavbarLanding = () => {
  return (
    <div className='flex justify-around bg-white'>
      <div>
        <ul className='list-none'>
          <li className='text-black font-bold'>CGPA Calculator</li>
        </ul>
      </div>
      <div >
        <ul className="flex gap-10 items-center list-none">
          <li className='text-black font-bold'>Home</li>
          <li className='text-black font-bold'>About</li>
          <li>
            <button className="px-4 py-2 bg-black text-white rounded">Login</button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NavbarLanding