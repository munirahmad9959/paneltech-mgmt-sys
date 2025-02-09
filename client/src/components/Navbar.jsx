// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiMenu } from 'react-icons/fi';

// const Navbar = () => {

//     const navigate = useNavigate();

//     const handleClick = () => {
//         navigate('/login');
//     }

//     return (
//         <div className='bg-[#E4E8EC] fixed w-screen left-0 top-0 z-[999]'>
//             <div className='flex justify-between items-center h-[70px] max-w-full mr-2 md:mr-10 md:ml-3'>
//                 <div className="flex items-center space-x-1 w-1/2 md:relative ml-2">
//                     <a href="/" className='bg-white rounded-full '>
//                         <img src="https://www.paneltechllc.com/wp-content/themes/paneltec/images/logo.png" alt="logo" className="w-[170px] md:w-[110px] cursor-pointer mx-3  rounded-full"/>
//                     </a>

//                     <span className='absolute w-[38px] h-[15px] left-[6.3rem] bg-white border border-white rounded-lg z-[-10]'></span>

//                     <div className='hidden md:block items-center bg-white border border-[#f3f3f3] rounded-full py-2'>
//                         <a href="#home" className="text-[#00234b] hover:text-[#8854c0] transition duration-300 hover:bg-[#efe5ff] px-3 py-[0.35rem] rounded-full">Platform</a>
//                         <a href="#about" className="text-[#00234b] hover:text-[#8854c0] transition duration-300 hover:bg-[#efe5ff] px-3 py-[0.35rem] rounded-full">Resources</a>
//                         <a href="#services" className="text-[#00234b] hover:text-[#8854c0] transition duration-300 hover:bg-[#efe5ff] px-3 py-[0.35rem] rounded-full">Pricing</a>
//                         <a href="#contact" className="text-[#00234b] hover:text-[#8854c0] transition duration-300 hover:bg-[#efe5ff] px-3 py-[0.35rem] rounded-full">Use Cases</a>
//                         <a href="#contact" className="text-[#00234b] hover:text-[rgb(136,84,192)] transition duration-300 hover:bg-[#efe5ff] px-3 py-[0.35rem] rounded-full">Why Remote</a>
//                     </div>
//                 </div>

//                 <nav className="flex items-center space-x-1 md:relative">
//                     <div className="flex items-center space-x-2 mr-2">
//                         <button className='text-[#00234b] border-2 border-[#f3f3f3] px-[0.7rem] py-[0.35rem] rounded-full transition duration-200 hover:bg-[#efe5ff] hidden md:flex items-center cursor-pointer space-x-2'>
//                             <img src='./resources/lang-icon.png' className='w-[24px] h-[24px]' />
//                             <span>English</span>
//                             <img src='./resources/down-arrow.png' />
//                         </button>
//                         <button className='text-[#00234b] border-2 border-[#f3f3f3] px-2 py-1 md:px-[0.7rem] md:py-[0.35rem] rounded-full transition duration-200 hover:bg-[#efe5ff] hidden md:flex items-center cursor-pointer space-x-2'>
//                             <img src='./resources/world-search-jobs.png' className='w-[24px] h-[24px]' />
//                             <span>Remote Jobs</span>
//                         </button>
//                     </div>
//                     <button className='text-[#00234b] bg-[#fff] px-3 py-1 rounded-full transition duration-200 hover:bg-[#efe5ff] hover:text-[rgb(136,84,192)] cursor-pointer' onClick={handleClick}>Log in</button>
//                     <button
//                         className="p-2 md:hidden"
//                         onClick={() => setShowSidebar((prev) => !prev)} // **Toggle Sidebar on click**
//                     >
//                         <FiMenu className="text-2xl text-[#5D2057]" />
//                     </button>
//                     <span className='absolute z-[-10] w-[25px] h-[15px] rounded-lg bg-white border-white right-[6.9rem]'></span>
//                     <button className='text-[#00234b] bg-[#fff] px-4 py-2 rounded-full transition duration-200 hover:bg-[#efe5ff] hover:text-[rgb(136,84,192)] hidden md:flex items-center cursor-pointer'>Book a Demo</button>
//                 </nav>
//             </div>
//         </div>
//     );
// };

// export default Navbar;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

const Navbar = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    }

    return (
        // 🟢 Increased `top` from `0` to `48px` (height of HeaderTop) so Navbar appears below HeaderTop
        <div className='bg-[#E4E8EC] fixed w-screen left-0 top-[48px] z-[999]'>
            <div className='flex justify-between items-center h-[70px] max-w-full mr-2 md:mr-10 md:ml-3'>
                <div className="flex items-center space-x-1 w-1/2 md:relative ml-2">
                    <a href="/" className='bg-white rounded-full '>
                        <img src="https://www.paneltechllc.com/wp-content/themes/paneltec/images/logo.png" alt="logo" className="w-[170px] md:w-[110px] cursor-pointer mx-3  rounded-full"/>
                    </a>

                    <span className='absolute w-[38px] h-[15px] left-[6.3rem] bg-white border border-white rounded-lg z-[-10]'></span>

                    <div className='hidden md:block items-center bg-white border border-[#f3f3f3] rounded-full py-2'>
                        <a href="#home" className="text-[#00234b] hover:text-[#8854c0] transition duration-300 hover:bg-[#efe5ff] px-3 py-[0.35rem] rounded-full">Platform</a>
                        <a href="#about" className="text-[#00234b] hover:text-[#8854c0] transition duration-300 hover:bg-[#efe5ff] px-3 py-[0.35rem] rounded-full">Resources</a>
                        <a href="#services" className="text-[#00234b] hover:text-[#8854c0] transition duration-300 hover:bg-[#efe5ff] px-3 py-[0.35rem] rounded-full">Pricing</a>
                        <a href="#contact" className="text-[#00234b] hover:text-[#8854c0] transition duration-300 hover:bg-[#efe5ff] px-3 py-[0.35rem] rounded-full">Use Cases</a>
                        <a href="#contact" className="text-[#00234b] hover:text-[rgb(136,84,192)] transition duration-300 hover:bg-[#efe5ff] px-3 py-[0.35rem] rounded-full">Why Remote</a>
                    </div>
                </div>

                <nav className="flex items-center space-x-1 md:relative">
                    <div className="flex items-center space-x-2 mr-2">
                        <button className='text-[#00234b] border-2 border-[#f3f3f3] px-[0.7rem] py-[0.35rem] rounded-full transition duration-200 hover:bg-[#efe5ff] hidden md:flex items-center cursor-pointer space-x-2'>
                            <img src='./resources/lang-icon.png' className='w-[24px] h-[24px]' />
                            <span>English</span>
                            <img src='./resources/down-arrow.png' />
                        </button>
                        <button className='text-[#00234b] border-2 border-[#f3f3f3] px-2 py-1 md:px-[0.7rem] md:py-[0.35rem] rounded-full transition duration-200 hover:bg-[#efe5ff] hidden md:flex items-center cursor-pointer space-x-2'>
                            <img src='./resources/world-search-jobs.png' className='w-[24px] h-[24px]' />
                            <span>Remote Jobs</span>
                        </button>
                    </div>
                    <button className='text-[#00234b] bg-[#fff] px-3 py-1 rounded-full transition duration-200 hover:bg-[#efe5ff] hover:text-[rgb(136,84,192)] cursor-pointer' onClick={handleClick}>Log in</button>
                    <button
                        className="p-2 md:hidden"
                        onClick={() => setShowSidebar((prev) => !prev)} // **Toggle Sidebar on click**
                    >
                        <FiMenu className="text-2xl text-[#5D2057]" />
                    </button>
                    <span className='absolute z-[-10] w-[25px] h-[15px] rounded-lg bg-white border-white right-[6.9rem]'></span>
                    <button className='text-[#00234b] bg-[#fff] px-4 py-2 rounded-full transition duration-200 hover:bg-[#efe5ff] hover:text-[rgb(136,84,192)] hidden md:flex items-center cursor-pointer'>Book a Demo</button>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;
