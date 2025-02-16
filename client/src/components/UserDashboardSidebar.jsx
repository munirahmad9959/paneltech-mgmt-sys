import React, { useState, useEffect } from 'react';
import { TiHome } from "react-icons/ti";
import { FaBook, FaChartPie } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { BiDonateHeart } from "react-icons/bi";
import { BsFillUnlockFill } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { TbReport } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { BsPeople } from "react-icons/bs";
import { PiAlarm, PiLeaf, PiWallet } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";

const UserDashboardSidebar = ({ setCurrentView, showSidebar, setShowSidebar }) => {
    const [activeLink, setActiveLink] = useState("Records");

    const links = [
        { name: "Employee Management", icon: <BsPeople style={{ fontSize: "1.2rem", marginRight: '5px' }} /> },
        { name: "Attendance", icon: <PiAlarm style={{ fontSize: "1.4rem", marginRight: '9px' }} /> },
        { name: "Leave", icon: <PiLeaf style={{ fontSize: "1.4rem", marginRight: '9px' }} /> },
        { name: "Payroll", icon: <PiWallet style={{ fontSize: "1.4rem", marginRight: '9px' }} /> },
        { name: "Settings", icon: <IoSettingsOutline style={{ fontSize: "1.4rem", marginRight: '9px' }} /> },
    ];

    useEffect(() => {
        setActiveLink(activeLink);
        console.log(activeLink);
    }, [activeLink]);

    return (
        <>
            {/* Sidebar toggles visibility based on `showSidebar` */}
            <aside className={`transition-transform transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 bg-white text-gray-700 p-4 fixed h-full z-40`}>
                <a href="/">
                    <img
                        src="https://www.paneltechllc.com/wp-content/themes/paneltec/images/logo.png"
                        alt="logo"
                        className="w-[130px] cursor-pointer"
                    />
                </a>
                <div className="flex flex-col max-w-[240px]">
                    {/* Create Button */}
                    <div className="flex items-center mx-auto">
                        <div className="flex font-semibold items-center button text-white bg-[#0cad5d] px-5 py-3 mt-3 rounded-md transition duration-200 hover:bg-[#0a9b53] cursor-pointer shadow-lg">
                            <span className="text-[17px] ml-1 mr-20">Dashboard</span>
                            <span>
                                <RxDashboard className='font-bold text-xl' />
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-36">
                        <ul className="text-[#666] space-y-2 mt-5">
                            {links.map((link) => (
                                <li
                                    key={link.name}
                                    onClick={() => {
                                        setActiveLink(link.name);
                                        setCurrentView(link.name); // Updated to set `currentView` 
                                        setShowSidebar(false);
                                    }}
                                    className={`flex items-center space-x-2 text-[16px] p-2 rounded-xl cursor-pointer transition duration-200 ${activeLink === link.name ? "bg-[#F6F0FF] text-[#0a9b53]" : "hover:bg-[#F6F0FF] hover:text-[#0cad5d]"
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="bottomElements w-full">
                            <span className="ml-2 text-[#000]">0/20 activities created</span>
                            <div className="flex justify-center items-center mx-auto">
                                <div className="flex font-semibold items-center space-x-1 button text-black px-[76px] py-3 mt-3 rounded-md transition duration-200 bg-[#ffc933] hover:bg-[#fdd356] cursor-pointer">
                                    <span><BsFillUnlockFill /></span>
                                    <span className="text-[15px]">Upgrade</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default UserDashboardSidebar;
