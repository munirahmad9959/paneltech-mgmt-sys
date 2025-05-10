import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);

    const handleClick = () => {
        navigate('/login');
    }

    const navLinks = [
        { name: "INTRODUCTION", url: "https://www.paneltechllc.com/introduction/" },
        { name: "OUR FACTORY", url: "https://www.paneltechllc.com/about/our-factory/" },
        { name: "CONSTRUCTION", url: "https://www.paneltechllc.com/construction/" },
        { name: "QUALITY STANDARDS", url: "https://www.paneltechllc.com/about/quality-standards/" },
        { name: "PRODUCTS", url: "https://www.paneltechllc.com/products/" }
    ];

    return (
        <div className='md:fixed w-screen left-0 top-[50px] md:top-[48px] z-[999] mb-2 md:mb-20 bg-[#fff]'>
            <div className='flex justify-between items-center h-[70px] max-w-full mx-auto px-9'>
                <div className="flex items-center space-x-1 w-full md:w-auto">
                    <a href="/">
                        <img
                            src="https://www.paneltechllc.com/wp-content/themes/paneltec/images/logo.png"
                            alt="logo"
                            className="w-[170px] md:w-[180px] cursor-pointer"
                        />
                    </a>

                    <div className='hidden md:flex items-center bg-white ml-4 space-x-4'>
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                className="text-[#00234b] hover:text-[#EA1C29] transition duration-300 bg-[#f9f9f9] hover:bg-[#efe5ff] px-4 py-2 rounded-full text-sm font-medium border border-[#e0e0e0] hover:shadow-lg"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center space-x-4">
                    <button
                        className='hidden md:block cursor-pointer text-[#00234b] hover:text-[#EA1C29] transition duration-300 bg-[#f9f9f9] hover:bg-[#efe5ff] px-4 py-2 rounded-full text-sm font-medium border border-[#e0e0e0] hover:shadow-lg'
                        onClick={handleClick}
                    >
                        Log in
                    </button>
                    <button
                        className="p-2 md:hidden"
                        onClick={() => setShowSidebar((prev) => !prev)}
                    >
                        {showSidebar ? (
                            <FiX className="text-2xl text-[#5D2057]" />
                        ) : (
                            <FiMenu className="text-2xl text-[#5D2057]" />
                        )}
                    </button>
                </div>

                {/* Mobile Sidebar */}
                {showSidebar && (
                    <div className="fixed inset-0 transition-all duration-300 backdrop-blur-xl bg-opacity-50 z-[1000] md:hidden" onClick={() => setShowSidebar(false)}>
                        <div
                            className={`absolute top-0 right-0 h-full w-3/4 bg-white shadow-lg p-4 overflow-y-auto transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${showSidebar ? 'translate-x-0' : 'translate-x-full'
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-end mb-4">
                                <button onClick={() => setShowSidebar(false)}>
                                    <FiX className="text-2xl text-[#5D2057]" />
                                </button>
                            </div>

                            <div className="flex flex-col space-y-4">
                                {navLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        className="text-[#00234b] hover:text-[#8854c0] transition duration-300 px-4 py-2 rounded-lg hover:bg-[#efe5ff]"
                                        onClick={() => setShowSidebar(false)}
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                <button
                                    className='text-[#00234b] bg-[#fff] px-4 py-2 rounded-lg transition duration-200 hover:bg-[#efe5ff] hover:text-[rgb(136,84,192)] cursor-pointer text-left border border-[#f3f3f3]'
                                    onClick={handleClick}
                                >
                                    Log in
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Navbar;