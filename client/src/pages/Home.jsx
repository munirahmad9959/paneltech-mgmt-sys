import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import { products } from '../../Utils/Utils';
import ProjectSlider from '../components/ProjectSlider';
import HeaderTop from '../components/HeaderTop';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../state';

const Home = () => {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  const imageUrls = [
    "https://www.paneltechllc.com/wp-content/themes/paneltec/images/ab-bg.jpg",
    "https://www.paneltechllc.com/wp-content/themes/paneltec/images/bg-shape.jpg",
    "https://www.paneltechllc.com/wp-content/themes/paneltec/images/background-image--bottom.jpg",
    ...products.map((product) => product.image),
  ];

  useEffect(() => {
    let isMounted = true; 
    dispatch(setLoading(true)); 

    let loadedImages = 0;
    imageUrls.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages++;
        if (loadedImages === imageUrls.length && isMounted) {
          setTimeout(() => {
            dispatch(setLoading(false)); 
          }, 1900);
        }
      };
    });

    return () => {
      isMounted = false; 
    };
  }, [dispatch]); 
  return (
    <div className='overflow-x-hidden h-full'>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
        </div>
      ) : (
        <>
          <HeaderTop />
          <Navbar />
          <div className="md:mt-[110px] mb-16 md:mb-14">
            <HeroSection />
          </div>

          {/* Body */}
          <div className='img+content md:-mt-[5.5rem]'>
            <div className="img relative my-14">
              <img src={imageUrls[0]} alt="" className='w-full h-[350px] object-cover' />
              <div className="content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-lg text-[#91A0C0] md:text-2xl font-semibold">Welcome To</h3>
                <h1 className="text-2xl text-[#2B2B2B] w-[300px] md:text-4xl font-bold mb-2">Paneltech International LLC</h1>
                <p className="text-[#404040] text-base md:text-lg w-[360px]">
                  Panel Tech International LLC, established in 2009, is one of the leading manufacturers of PIR, PU & Rockwool Sandwich Panels, Profile Sheets & Z Purlins throughout the Sultanate of Oman. Working closely with our customers, we provide advice on the best solution for each project.
                </p>
                <a href="https://www.paneltechllc.com/production-technology/">
                  <button className='px-8 py-4 bg-[#ea1c29] rounded-full text-white font-bold mt-3 cursor-pointer'>
                    READ MORE
                  </button>
                </a>
              </div>
            </div>
          </div>


          {/* for the our products section */}
          <div className="products-section w-full relative min-h-[50vh]">
            {/* Background div - now uses min-height to expand with content */}
            <div className="absolute min-h-full w-full bg-cover md:bg-center bg-size(150%) md:bg-no-repeat"
              style={{ backgroundImage: `url(${imageUrls[1]})` }}></div>

            <div className="relative z-10 flex flex-col pt-7 items-center text-[#222] pb-14 md:pb-[20rem]">
              <span className='text-sm md:text-lg font-light text-[#777777]'>Paneltech International</span>
              <h1 className='font-bold text-2xl md:text-4xl text-[#2B2B2B]'>Our Products</h1>
            </div>

            {/* Products grid - now positioned relative with padding-bottom */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 px-4 sm:px-10 md:px-20 w-full pb-10 md:pb-28">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center bg-white p-2 sm:p-4 rounded-lg shadow-md cursor-pointer hover:bg-red-500 hover:scale-105 transition-transform"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full h-auto mb-2 w-64"
                  />
                  <span className="text-center text-sm sm:text-sm font-medium">{product.name}</span>
                </div>
              ))}
            </div>
          </div>


          {/* Production Section */}
          <div className="production-tech relative">
            <div className="image absolute bg-cover bg-center inset-0 bg-no-repeat" style={{ backgroundImage: `url(${imageUrls[2]})` }}></div>
            <div className="content relative z-10 flex flex-col items-center justify-center text-center h-[20rem] md:h-[30rem] text-[#fff]">
              <h1 className='text-2xl md:text-5xl font-bold md:my-3'>Production Technology</h1>
              <span className='text-base w-3/4  md:text-lg md:max-w-[850px] my-5'>Metal coils which enter the panel production line are shaped on the roll formers. And they form the external and internal surfaces..</span>
              <a href="https://www.paneltechllc.com/production-technology/"><button className='px-[1.5rem] py-[0.4rem] md:px-[2.3rem] md:py-[0.85rem] cursor-pointer rounded-full bg-transparent border-2 border-white'>READ MORE</button></a>
            </div>
          </div>

          {/* Our Projects */}

          <div className="projects mt-14 md:mt-24">
            <h1 className='text-2xl md:text-5xl font-bold text-[#222] text-center md:mb-20'>Our Projects</h1>
            <ProjectSlider />
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};

export default Home;
