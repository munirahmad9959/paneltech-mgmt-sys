import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'

const Home = () => {
  return (
    <div className='overflow-x-hidden h-full w-screen'>
      <Navbar />
      <HeroSection/>
    </div>
  )
}

export default Home
