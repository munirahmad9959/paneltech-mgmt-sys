import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
// import { ApiClient } from '../../Utils';
import { FaFilter } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

const UserDashboard = ({ setShowSidebar, setNavDropDown }) => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();


    return (
        <div className="p-6 bg-white min-h-screen"
            onClick={() => {
                setShowSidebar(false);
                setNavDropDown(false);
            }}>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex justify-center">
                <h1 className="text-3xl font-bold mb-6 text-[#2b2a2a]">User Dashboard</h1>
            </div>

        </div>
    );
};

export default UserDashboard;
