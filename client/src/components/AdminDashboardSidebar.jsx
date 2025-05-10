import React, { useState, useEffect } from "react";
import { PiAlarm, PiLeaf, PiWallet } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { GrGroup } from "react-icons/gr";
import { IoPersonOutline } from "react-icons/io5";

const AdminDashboardSidebar = ({ setCurrentView, showSidebar, setShowSidebar }) => {
    const [activeLink, setActiveLink] = useState("Profile");

    const links = [
        { name: "Profile", icon: <IoPersonOutline style={{ fontSize: "1.2rem", marginRight: '5px' }} /> },
        { name: "Attendance", icon: <PiAlarm style={{ fontSize: "1.4rem", marginRight: '9px' }} /> },
        { name: "Leave", icon: <PiLeaf style={{ fontSize: "1.4rem", marginRight: '9px' }} /> },
        { name: "Payroll", icon: <PiWallet style={{ fontSize: "1.4rem", marginRight: '9px' }} /> },
        { name: "Employee List", icon: <GrGroup style={{ fontSize: "1.4rem", marginRight: '9px' }} /> },
    ];

    useEffect(() => {
        setActiveLink(activeLink);
    }, [activeLink]);

    return (
        <aside className={`transition-transform transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 bg-white text-gray-700 p-4 fixed h-full z-40`}>
            <a href="/">
                <img src="https://www.paneltechllc.com/wp-content/themes/paneltec/images/logo.png" alt="logo" className="w-[130px] cursor-pointer" />
            </a>
            <div className="flex flex-col max-w-[240px]">
                {/* Dashboard Button */}
                <div className="flex items-center mx-auto">
                    <div className="flex font-semibold items-center button text-white bg-[#0cad5d] px-5 py-3 mt-3 rounded-md transition duration-200 hover:bg-[#0a9b53] shadow-lg">
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
                                    setCurrentView(link.name); 
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
                </div>
            </div>
        </aside>
    );
};

export default AdminDashboardSidebar;
