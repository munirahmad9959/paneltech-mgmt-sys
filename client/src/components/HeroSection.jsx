import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { urls, urlsMobile } from "../../Utils/Utils";

const HeroSection = () => {
  const [currentUrls, setCurrentUrls] = useState(urls);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      setIsMobile(mobile);
      setCurrentUrls(mobile ? urlsMobile : urls);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomArrow direction="prev" isMobile={isMobile} />,
    nextArrow: <CustomArrow direction="next" isMobile={isMobile} />,
    appendDots: (dots) => (
      <div className="custom-dots">
        <ul>{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-4 h-4 bg-gray-400 rounded-full opacity-70 hover:opacity-100"></div>
    ),
  };

  return (
    <div className="md:h-screen w-screen overflow-hidden relative text-black">
      <Slider {...settings} className="h-full">
        {currentUrls.map((slide, index) => (
          <div key={index} className="md:h-screen w-full relative">
            <div className="relative h-[254px] md:h-[550px] w-full"> 
              <img 
                src={slide.url} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute top-48 left-24 inset-0 flex flex-col px-6">
              {slide.heading && <h2 className="text-3xl font-semibold">{slide.heading}</h2>}
              {slide.title && <h1 className="text-5xl font-bold pt-0 text-[#EA1C29]">{slide.title}</h1>}
              {slide.description && <p className="text-lg mt-7 max-w-[550px]">{slide.description}</p>}
              {(slide.readMoreLink || slide.contactUsLink) && (
                <div className="mt-6 flex space-x-6">
                  {slide.readMoreLink && (
                    <a
                      href="http://www.paneltechllc.com/products/z-c-purlins/"
                      className="px-9 py-4 bg-[#EA1C29] text-white font-bold rounded-full"
                    >
                      READ MORE
                    </a>
                  )}
                  {slide.contactUsLink && (
                    <a
                      href="http://www.paneltechllc.com/contact-us/"
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

const CustomArrow = ({ direction, onClick, isMobile }) => {
  return (
    <button
      className={`absolute ${isMobile ? 'top-[127px]' : 'top-[275px]'} transform -translate-y-1/2 z-10 ${
        direction === "prev" ? "left-6" : "right-6"
      } bg-white text-gray-800 rounded-full p-2 opacity-40 md:p-4 shadow-lg hover:bg-gray-200 cursor-pointer`}
      onClick={onClick}
    >
      {direction === "prev" ? <MdArrowBackIos size={24} /> : <MdArrowForwardIos size={24} />}
    </button>
  );
};

export default HeroSection;