// import React from "react";
// import Slider from "react-slick";
// import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

// const HeroSection = () => {
//   // Slider Settings
//   const settings = {
//     dots: true, // Enables bottom bullets
//     infinite: true,
//     autoplay: true, // Enables the timer
//     autoplaySpeed: 2000, // 2 seconds timer
//     speed: 800, // Transition speed
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true, // Enables left and right arrows
//     prevArrow: <CustomArrow direction="prev" />,
//     nextArrow: <CustomArrow direction="next" />,
//     appendDots: (dots) => (
//       <div className="custom-dots">
//         <ul>{dots}</ul>
//       </div>
//     ),
//     customPaging: (i) => (
//       <div className="w-4 h-4 bg-gray-400 rounded-full opacity-70 hover:opacity-100"></div>
//     ),
//   };

//   const urls = [
//     'https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-4.jpg',
//     'https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-1.jpg',
//     'https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-2.png',
//     'https://www.paneltechllc.com/wp-content/uploads/2019/01/background-image-3.png',
//     'https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-5.jpg',
//     'https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-6.jpg',
//     'https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-7.jpg',
//     'https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-8.jpg',
//     'https://www.paneltechllc.com/wp-content/uploads/2019/02/background-image-9.jpg'
//   ]

//   return (
//     <div className="h-screen w-screen overflow-hidden relative">
//       <Slider {...settings} className="h-full">


//         {urls.map((url, index) => (
//           <div key={index} className="h-screen w-full flex justify-center items-center text-white text-5xl font-bold">
//             <img src={url} alt={`Slide ${index + 1}`} />
//           </div>
//         ))}
        
//       </Slider>
//     </div>
//   );
// };

// // Custom Arrow Component
// const CustomArrow = ({ direction, onClick }) => {
//   return (
//     <button
//       className={`absolute top-1/2 transform -translate-y-1/2 z-10 ${
//         direction === "prev" ? "left-6" : "right-6"
//       } bg-white text-gray-800 rounded-full p-4 shadow-lg hover:bg-gray-200 cursor-pointer`}
//       onClick={onClick}
//     >
//       {direction === "prev" ? <MdArrowBackIos size={24} /> : <MdArrowForwardIos size={24} />}
//     </button>
//   );
// };

// export default HeroSection;

// import React from "react";
// import Slider from "react-slick";
// import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
// import { urls } from "../../Utils";

// const HeroSection = () => {
//   // Slider Settings
//   const settings = {
//     dots: true,
//     infinite: true,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     speed: 800,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//     prevArrow: <CustomArrow direction="prev" />,
//     nextArrow: <CustomArrow direction="next" />,
//     appendDots: (dots) => (
//       <div className="custom-dots">
//         <ul>{dots}</ul>
//       </div>
//     ),
//     customPaging: (i) => (
//       <div className="w-4 h-4 bg-gray-400 rounded-full opacity-70 hover:opacity-100"></div>
//     ),
//   };

//   return (
//     <div className="h-screen w-screen overflow-hidden relative text-black">
//       <Slider {...settings} className="h-full">
//         {urls.map((url, index) => (
//           <div
//             key={index}
//             className="h-screen w-full relative flex justify-center items-center"
//           >
//             <img src={url} alt={`Slide ${index + 1}`} className="w-full h-full" />
//             <div className="absolute inset-0 flex flex-col px-6">
//               <h2 className="text-2xl font-semibold">Products</h2>
//               <h1 className="text-4xl font-bold mt-2">{slideContent[index]?.title}</h1>
//               <p className="text-lg text-center mt-4 max-w-2xl">{slideContent[index]?.description}</p>
//               <div className="mt-6 flex space-x-6">
//                 <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
//                   READ MORE
//                 </button>
//                 <button className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg">
//                   CONTACT US
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// // Custom Arrow Component
// const CustomArrow = ({ direction, onClick }) => {
//   return (
//     <button
//       className={`absolute top-1/2 transform -translate-y-1/2 z-10 ${
//         direction === "prev" ? "left-6" : "right-6"
//       } bg-white text-gray-800 rounded-full p-4 shadow-lg hover:bg-gray-200 cursor-pointer`}
//       onClick={onClick}
//     >
//       {direction === "prev" ? <MdArrowBackIos size={24} /> : <MdArrowForwardIos size={24} />}
//     </button>
//   );
// };

// export default HeroSection;


// import React from "react";
// import Slider from "react-slick";
// import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
// import { urls } from "../../Utils";

// const HeroSection = () => {
//   // Slider Settings
//   const settings = {
//     dots: true,
//     infinite: true,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     speed: 800,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//     prevArrow: <CustomArrow direction="prev" />,
//     nextArrow: <CustomArrow direction="next" />,
//     appendDots: (dots) => (
//       <div className="custom-dots">
//         <ul>{dots}</ul>
//       </div>
//     ),
//     customPaging: (i) => (
//       <div className="w-4 h-4 bg-gray-400 rounded-full opacity-70 hover:opacity-100"></div>
//     ),
//   };

//   return (
//     <div className="h-screen w-screen overflow-hidden relative text-black">
//       <Slider {...settings} className="h-full">
//         {urls.map((slide, index) => (
//           <div
//             key={index}
//             className="h-screen w-full relative flex justify-center items-center"
//           >
//             <img src={slide.url} alt={`Slide ${index + 1}`} className="w-full h-full" />
//             <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">
//               <h2 className="text-2xl font-semibold">{slide.heading}</h2>
//               <h1 className="text-4xl font-bold mt-2">{slide.title}</h1>
//               <p className="text-lg mt-4 max-w-2xl">{slide.description}</p>
//               <div className="mt-6 flex space-x-6">
//                 <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
//                   READ MORE
//                 </button>
//                 <button className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg">
//                   CONTACT US
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// // Custom Arrow Component
// const CustomArrow = ({ direction, onClick }) => {
//   return (
//     <button
//       className={`absolute top-1/2 transform -translate-y-1/2 z-10 ${
//         direction === "prev" ? "left-6" : "right-6"
//       } bg-white text-gray-800 rounded-full p-4 shadow-lg hover:bg-gray-200 cursor-pointer`}
//       onClick={onClick}
//     >
//       {direction === "prev" ? <MdArrowBackIos size={24} /> : <MdArrowForwardIos size={24} />}
//     </button>
//   );
// };

// export default HeroSection;

import React from "react";
import Slider from "react-slick";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { urls } from "../../Utils";

const HeroSection = () => {
  // Slider Settings
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    appendDots: (dots) => (
      <div className="custom-dots">
        <ul>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className="w-4 h-4 bg-gray-400 rounded-full opacity-70 hover:opacity-100"></div>
    ),
  };

  return (
    <div className="h-screen w-screen overflow-x-hidden relative text-black">
      <Slider {...settings} className="h-full">
        {urls.map((slide, index) => (
          <div
            key={index}
            className="h-screen w-full relative"
          >
            <img src={slide.url} alt={`Slide ${index + 1}`} className="w-full h-[550px]" />
            <div className="absolute top-48 left-24 inset-0 flex flex-col px-6">
              {slide.heading && <h2 className="text-3xl font-semibold">{slide.heading}</h2>}
              {slide.title && <h1 className="text-5xl font-bold pt-0 text-[#EA1C29]">{slide.title}</h1>}
              {slide.description && <p className="text-lg mt-7 max-w-[550px]">{slide.description}</p>}
              {(slide.readMoreLink || slide.contactUsLink) && (
                <div className="mt-6 flex space-x-6">
                  {slide.readMoreLink && (
                    <a
                      href={slide.readMoreLink}
                      className="px-9 py-4 bg-[#EA1C29] text-white font-bold rounded-full"
                    >
                      READ MORE
                    </a>
                  )}
                  {slide.contactUsLink && (
                    <a
                      href={slide.contactUsLink}
                      className="px-9 py-4 bg-[#fff] text-[#050505] font-bold border-2 border-black rounded-full"
                    >
                      CONTACT US
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Custom Arrow Component
const CustomArrow = ({ direction, onClick }) => {
  return (
    <button
      className={`absolute top-1/2 transform -translate-y-1/2 z-10 ${
        direction === "prev" ? "left-6" : "right-6"
      } bg-white text-gray-800 rounded-full p-4 shadow-lg hover:bg-gray-200 cursor-pointer`}
      onClick={onClick}
    >
      {direction === "prev" ? <MdArrowBackIos size={24} /> : <MdArrowForwardIos size={24} />}
    </button>
  );
};

export default HeroSection;