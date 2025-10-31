import React from 'react'
import '../../index.css'
import NavbarLanding from './NavbarLanding'
import Body1 from './Body1'
import FooterLanding from './FooterLanding'

const Landing = () => {
  return (
    <div className='min-h-screen bg-white w-full overflow-x-hidden'>
      <NavbarLanding/>
      <Body1/>
      <FooterLanding/>
    </div>
  )
}

export default Landing