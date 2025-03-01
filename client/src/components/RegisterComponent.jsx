import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../state';
import { ApiClient } from "../../Utils";

const RegisterComponent = () => {
    const loading = useSelector((state) => state.auth.loading);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        PicturePath: '',
        Role: 'employee',
    });

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!formData.FullName || !formData.Email || !formData.Password || !formData.ConfirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (formData.Password !== formData.ConfirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (formData.Password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        dispatch(setLoading(true));

        try {
            const requestData = {
                fullName: formData.FullName,
                email: formData.Email,
                password: formData.Password,
                picturePath: formData.PicturePath,
                role: formData.Role
            };

            const response = await ApiClient.post('/auth/register', requestData);
            console.log("Registration successful:", response.data);
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 md:mt-7">
                Create an account
            </h2>
            <form className="w-full max-w-md space-y-4" onSubmit={handleRegister}>
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                        type="text"
                        name="FullName"
                        placeholder="Enter full name"
                        value={formData.FullName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-md"
                    />
                </div>

                {/* Email Address */}
                <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                        type="email"
                        name="Email"
                        placeholder="Enter email address"
                        value={formData.Email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-md"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        name="Password"
                        placeholder="Enter password"
                        value={formData.Password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-md"
                    />
                    <p className="text-[#666] text-[11px]">
                        Use 8 or more characters with a mix of letters, numbers & symbols
                    </p>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <input
                        type="password"
                        name="ConfirmPassword"
                        placeholder="Confirm password"
                        value={formData.ConfirmPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-md"
                    />
                </div>

                <div className="oath text-[12px]">
                    <p className="text-[#666]">
                        By creating an account, you agree to our
                        <span className="text-[#111] underline cursor-pointer"> Terms of Use</span>
                        and
                        <span className="text-[#111] underline cursor-pointer"> Privacy Policy</span>
                    </p>
                </div>

                {/* CAPTCHA */}
                <div className="flex items-center justify-between border border-gray-300 rounded-full p-3 w-[15rem] mt-7">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="NotRobot"
                            id="not-robot"
                            checked={formData.NotRobot}
                            onChange={handleChange}
                            className="mx-3 w-5 h-5 border-gray-400 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <label htmlFor="not-robot" className="text-sm font-medium text-gray-600">
                            I'm not a robot
                        </label>
                    </div>
                    <img
                        src="./resources/google-recaptcha.png"
                        alt="reCAPTCHA"
                        className="h-8"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-[#5104e5] text-white font-medium py-3 rounded-lg hover:bg-[#4003b7] cursor-pointer"
                >
                    Create account
                </button>
            </form>
        </>
    );
};

export default RegisterComponent;
