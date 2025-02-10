import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaFilter } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid"; // Import uuid
import { setLoading } from "../state";
import PlayLoading from "./PlayLoading";
import { ApiClient } from "../../utils";
import { ToastContainer } from "react-toastify";

const AdminDashboard = ({ setShowSidebar, setNavDropDown }) => {
    const token = useSelector((state) => state.auth.token);

    const loading = useSelector((state) => state.auth.loading);
    const dispatch = useDispatch();

    return (
        <div className="p-6 bg-gray-50 min-h-screen"
            onClick={() => {
                setShowSidebar(false);
                setNavDropDown(false);
            }}>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex justify-center">
                <h1 className="text-3xl font-bold mb-6 text-[#2b2a2a]">Admin Dashboard</h1>
            </div>

        </div>);
};

export default AdminDashboard;
