// import React from 'react'
// import Navbar from '../components/Navbar'
// import HeroSection from '../components/HeroSection'
// import Footer from '../components/Footer'
// import { products } from '../../Utils'
// import ProjectSlider from '../components/ProjectSlider'
// import HeaderTop from '../components/HeaderTop'

// const Home = () => {
//   return (
//     <div className='overflow-x-hidden h-full w-screen'>
//       <HeaderTop />
//       <Navbar />
//       <HeroSection />
//       {/* Body */}
//       <div className='img+content -mt-[5.5rem]'>
//         <div className="img relative">
//           <img src="https://www.paneltechllc.com/wp-content/themes/paneltec/images/ab-bg.jpg" alt="" className='w-full h-[350px] object-cover' />

//           {/* Centered Content */}
//           <div className="content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
//         flex flex-col items-center justify-center text-center p-4">
//             <h3 className="text-2xl font-semibold">Welcome To</h3>
//             <h1 className="text-4xl font-bold mb-2">Paneltech International LLC</h1>
//             <p className="text-lg">
//               Panel Tech International LLC, established in 2009, is one of the leading manufacturers of PIR, PU & Rockwool Sandwich Panels, Profile Sheets & Z Purlins throughout the Sultanate of Oman. Working closely with our customers, we provide advice on the best solution for each project.
//             </p>
//             <button className='px-7 py-4 bg-[#ea1c29] rounded-full text-white font-semibold mt-3 cursor-pointer'>
//               READ MORE</button>
//           </div>
//         </div>
//       </div>

// <div className="products-section w-full relative">
//   {/* Background image with opacity */}
//   <div
//     className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//     style={{ backgroundImage: 'url(https://www.paneltechllc.com/wp-content/themes/paneltec/images/bg-shape.jpg)' }}
//   ></div>

//   {/* Content */}
//   <div className="relative z-10 flex flex-col pt-7 items-center  h-[45rem] text-[#222]">
//     <span className='text-lg font-light'>Paneltech International</span>
//     <h1 className='font-bold text-4xl'>Our Products</h1>
//   </div>

//   {/* Image grid with names */}
//   <div className="absolute bottom-28 z-10 grid grid-cols-4 gap-4 px-20">
//     {products.map((product, index) => (
//       <div key={index} className="flex flex-col justify-center items-center bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-red-500 hover:scale-105 transition-transform">
//         <img src={product.image} alt={product.name} className="max-w-full h-auto mb-2" />
//         <span className="text-center text-sm font-medium">{product.name}</span>
//       </div>
//     ))}
//   </div>
// </div>

// <div className="production-tech relative">
//   <div className="image absolute bg-cover bg-center inset-0 bg-no-repeat" style={{ backgroundImage: 'url(https://www.paneltechllc.com/wp-content/themes/paneltec/images/background-image--bottom.jpg)' }}></div>
//   <div className="content relative z-10 flex flex-col items-center justify-center text-center h-[30rem] text-[#fff]">
//     <h1 className='text-5xl font-bold my-3'>Production Technology</h1>
//     <span className='text-lg max-w-[850px] my-5'>Metal coils which enter the panel production line are shaped on the roll formers. And they form the external and internal surfaces..</span>
//     <button className='px-[2.3rem] py-[0.85rem] cursor-pointer rounded-full bg-transparent border-2 border-white'>READ MORE</button>
//   </div>
// </div>

//       <div className="projects my-32">
//         <h1 className='text-5xl font-bold text-[#222] text-center mb-20'>Our Projects</h1>
//         <ProjectSlider />
//       </div>

//       {/* <div className="mb-64"></div> */}
//       <Footer />
//     </div>
//   )
// }

// export default Home


import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'
import { products } from '../../Utils'
import ProjectSlider from '../components/ProjectSlider'
import HeaderTop from '../components/HeaderTop'

const Home = () => {
  return (
    <div className='overflow-x-hidden h-full w-screen'>
      {/* 🟢 Ensure HeaderTop is always at the top */}
      <HeaderTop />

      {/* 🟢 Navbar now comes below HeaderTop */}
      <Navbar />

      {/* 🟢 Added margin-top to HeroSection to prevent overlap */}
      <div className="mt-[110px] mb-14">
        <HeroSection />
      </div>

      {/* Body */}
      <div className='img+content -mt-[5.5rem]'>
        <div className="img relative">
          <img src="https://www.paneltechllc.com/wp-content/themes/paneltec/images/ab-bg.jpg" alt="" className='w-full h-[350px] object-cover' />

          {/* Centered Content */}
          <div className="content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        flex flex-col items-center justify-center text-center p-4">
            <h3 className="text-2xl font-semibold">Welcome To</h3>
            <h1 className="text-4xl font-bold mb-2">Paneltech International LLC</h1>
            <p className="text-lg">
              Panel Tech International LLC, established in 2009, is one of the leading manufacturers of PIR, PU & Rockwool Sandwich Panels, Profile Sheets & Z Purlins throughout the Sultanate of Oman. Working closely with our customers, we provide advice on the best solution for each project.
            </p>
            <button className='px-8 py-4 bg-[#ea1c29] rounded-full text-white font-bold mt-3 cursor-pointer'>
              READ MORE</button>
          </div>
        </div>
      </div>
      <div className="products-section w-full relative">
        {/* Background image with opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://www.paneltechllc.com/wp-content/themes/paneltec/images/bg-shape.jpg)' }}
        ></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col pt-7 items-center  h-[45rem] text-[#222]">
          <span className='text-lg font-light'>Paneltech International</span>
          <h1 className='font-bold text-4xl'>Our Products</h1>
        </div>

        {/* Image grid with names */}
        <div className="absolute bottom-28 z-10 grid grid-cols-4 gap-4 px-20">
          {products.map((product, index) => (
            <div key={index} className="flex flex-col justify-center items-center bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-red-500 hover:scale-105 transition-transform">
              <img src={product.image} alt={product.name} className="max-w-full h-auto mb-2" />
              <span className="text-center text-sm font-medium">{product.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="production-tech relative">
        <div className="image absolute bg-cover bg-center inset-0 bg-no-repeat" style={{ backgroundImage: 'url(https://www.paneltechllc.com/wp-content/themes/paneltec/images/background-image--bottom.jpg)' }}></div>
        <div className="content relative z-10 flex flex-col items-center justify-center text-center h-[30rem] text-[#fff]">
          <h1 className='text-5xl font-bold my-3'>Production Technology</h1>
          <span className='text-lg max-w-[850px] my-5'>Metal coils which enter the panel production line are shaped on the roll formers. And they form the external and internal surfaces..</span>
          <button className='px-[2.3rem] py-[0.85rem] cursor-pointer rounded-full bg-transparent border-2 border-white'>READ MORE</button>
        </div>
      </div>

      <div className="projects my-32">
        <h1 className='text-5xl font-bold text-[#222] text-center mb-20'>Our Projects</h1>
        <ProjectSlider />
      </div>

      <Footer />
    </div>
  )
}

export default Home
