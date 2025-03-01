// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import RegisterComponent from '../components/RegisterComponent';
// import { setLoading } from '../state';
// import { useSelector } from 'react-redux';
// import PlayLoading from '../components/PlayLoading';

// const RegisterPage = () => {
//   const navigate = useNavigate();
//   const loading = useSelector((state) => state.auth.loading);

//   const handleClick = () => {
//     navigate('/login');
//   }


//   return (
//     <>
//       {loading && <PlayLoading />}
//       <div className="bg-[#FFFBF4] min-h-screen">
//         <div className="fixed w-screen left-0 top-0 z-[999] bg-[#E4E8EC]">
//           <div className="flex justify-between items-center h-[80px] max-w-full mr-10 ml-3">
//             <div className="flex items-center space-x-5">
//               <a href="/"><img src="https://www.paneltechllc.com/wp-content/themes/paneltec/images/logo.png" alt="logo" className="w-[120px] cursor-pointer" /></a>
//             </div>
//             <nav className="flex items-center space-x-1 relative">
              
//               <button className="text-[#5a05ff] bg-[#fff] px-3 py-1 rounded-full transition duration-200 hover:bg-[#efe5ff] cursor-pointer" onClick={handleClick}>
//                 Log in
//               </button>
//               <span className='absolute z-[-10] w-[25px] h-[15px] rounded-lg bg-white border-white right-[6.9rem]'></span>

//               <button className="text-[#5a05ff] bg-[#fff] px-4 py-2 rounded-full transition duration-200 hover:bg-[#efe5ff] hidden md:flex items-center cursor-pointer">
//                 Book a Demo
//               </button>
//             </nav>
//           </div>
//         </div>

//         <div className="flex justify-center items-center px-4 py-24 sm:px-0">
//           <div className="container bg-[#eff3f7] rounded-xl flex flex-col md:flex-row justify-center items-center mx-auto w-full max-w-[850px] space-y-5 md:space-y-0 md:space-x-10 p-5">
//             <div className="left w-full md:w-1/2">
//               <img src="./resources/register-side-image.png" alt="register" className="w-full h-full object-cover rounded-lg hidden sm:block" />
//             </div>
//             <div className="rightRegisterForm w-full md:w-1/2">
//               <RegisterComponent />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RegisterPage;


import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../state';
import RegisterComponent from '../components/RegisterComponent';

const RegisterPage = () => {
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  // Image sources to preload
  const imageSources = [
    "https://www.paneltechllc.com/wp-content/themes/paneltec/images/logo.png",
    "./resources/register-side-image.png",
  ];

  useEffect(() => {
    let isMounted = true; 
    dispatch(setLoading(true));

    let loadedImages = 0;
    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages++;
        if (loadedImages === imageSources.length && isMounted) {
          setTimeout(() => {
            dispatch(setLoading(false)); 
          }, 1500);
        }
      };
    });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const handleClick = () => {
    navigate('/login');
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFBF4] min-h-screen">
      <div className="fixed w-screen left-0 top-0 z-[999] bg-[#E4E8EC]">
        <div className="flex justify-between items-center h-[80px] max-w-full mr-10 ml-3">
          <div className="flex items-center space-x-5">
            <a href="/"><img src="https://www.paneltechllc.com/wp-content/themes/paneltec/images/logo.png" alt="logo" className="w-[120px] cursor-pointer" /></a>
          </div>
          <nav className="flex items-center space-x-1 relative">
            <button className="text-[#5a05ff] bg-[#fff] px-3 py-1 rounded-full transition duration-200 hover:bg-[#efe5ff] cursor-pointer" onClick={handleClick}>
              Log in
            </button>
            <span className='absolute z-[-10] w-[25px] h-[15px] rounded-lg bg-white border-white right-[6.9rem]'></span>
            <button className="text-[#5a05ff] bg-[#fff] px-4 py-2 rounded-full transition duration-200 hover:bg-[#efe5ff] hidden md:flex items-center cursor-pointer">
              Book a Demo
            </button>
          </nav>
        </div>
      </div>

      <div className="flex justify-center items-center px-4 py-24 sm:px-0">
        <div className="container bg-[#eff3f7] rounded-xl flex flex-col md:flex-row justify-center items-center mx-auto w-full max-w-[850px] space-y-5 md:space-y-0 md:space-x-10 p-5">
          <div className="left w-full md:w-1/2">
            <img src="./resources/register-side-image.png" alt="register" className="w-full h-full object-cover rounded-lg hidden sm:block" />
          </div>
          <div className="rightRegisterForm w-full md:w-1/2">
            <RegisterComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
