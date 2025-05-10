import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../state';
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { setLoading } from '../state';
import { createApiClient } from '../../Utils/Utils';
import { FiMenu } from 'react-icons/fi';
import persistor from '../main';
import { useNavigate } from 'react-router-dom';
import PlayLoading from './PlayLoading';

const DashboardNavbar = ({ setShowSidebar, navDropDown, setNavDropDown }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth.loading);
    const navigate = useNavigate();
    const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);


    const handleLogout = async () => {
        dispatch(setLoading(true));
        try {
            await ApiClient.post("/auth/logout");
            dispatch(setLogout());
            await persistor.purge();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error.message);
        } finally {
            setTimeout(() => {
                dispatch(setLoading(false));
            }, 1500);
        }
    };


    const toggleDropdown = () => {
        setNavDropDown(!navDropDown);
    };


    return (
        <>
            {loading && <PlayLoading />}
            <nav className="bg-white shadow p-2 flex items-center justify-between pr-5">

                {/* Burger Icon on the top-left */}
                <button
                    className="p-2 md:hidden"
                    onClick={() => setShowSidebar((prev) => !prev)} // **Toggle Sidebar on click**
                >
                    <FiMenu className="text-2xl text-gray-700" />
                </button>

                {/* Right section: User Dropdown */}
                <div className="space-x-3 flex ml-auto items-center">
                    {/* Dropdown Button */}
                    <div className="relative">
                        <button
                            id="dropdownInformationButton"
                            onClick={toggleDropdown}
                            className="px-3 py-1 border border-[#bababa] text-[#666] rounded-3xl flex items-center bg-white hover:bg-gray-100 cursor-pointer"
                            type="button"
                        >
                            {user.user?.profileImage ? (
                                <img
                                    src={`http://localhost:3000${user.user?.profileImage}`}
                                    alt="User Avatar"
                                    className="w-[20px] h-[20px] rounded-full"
                                />
                            ) : (
                                <img src={`http://localhost:3000/uploads/noavatar.png`} alt="" className="w-[20px] h-[20px] rounded-full" />
                            )}
                            <IoIosArrowDown
                                className={`ml-2 transition-transform duration-300 ${navDropDown ? "rotate-180" : ""}`}
                            />
                        </button>
                        {/* Dropdown Menu */}
                        {navDropDown && (
                            <div
                                id="dropdownInformation"
                                className="absolute z-10 mt-2 right-0 bg-white rounded-lg shadow w-44"
                                style={{ borderColor: "#cecece" }} 
                            >
                                {/* User Info Section */}
                                <div className="px-4 py-3 text-sm text-gray-900 border-b" style={{ borderColor: "#cecece" }}>
                                    <div>{user.user?.fullName}</div>
                                    <div className="font-medium truncate font-sans text-[12px] text-blue-500 cursor-pointer"><a href={`mailto:${user.user?.email}`}>{user.user?.email}</a></div>
                                </div>
                                {/* Links Section */}
                                <ul
                                    className="py-2 text-sm text-gray-700"
                                    aria-labelledby="dropdownInformationButton"
                                >
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-gray-900" onClick={handleLogout}>
                                            Sign out
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default DashboardNavbar;
