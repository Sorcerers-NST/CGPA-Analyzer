import React from 'react'
import Logo from '../../assets/Logo.png'
const NavbarLanding = () => {
  return (
    <div className='flex justify-around bg-white'>
      <div>
        <ul className='flex list-none'>
          <li>
            <img src={Logo} alt="Logo" className=' h-28 w-28'/>
          </li>
        </ul>
      </div>
      <div >
        <ul className=" mt-8 flex gap-10 items-center list-none">
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