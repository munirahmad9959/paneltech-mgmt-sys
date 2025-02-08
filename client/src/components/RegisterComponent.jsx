import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../state';
// import { ApiClient } from '../../utils';

const RegisterComponent = () => {
    const loading = useSelector((state) => state.auth.loading);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        Role: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        // try {
        //     await ApiClient.post('/Auth/register', formData);
        //     navigate('/login');
        // } catch (error) {
        //     console.error(`Error from RegistrationForm: ${error}`);
        // } finally {
        //     dispatch(setLoading(false));
        // }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 md:mt-7">Create an account</h2>
            <form className="w-full max-w-md space-y-4">
                {/* Email Address */}
                <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter email address"
                        className="w-full border border-gray-300 p-3 rounded-md"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        className="w-full border border-gray-300 p-3 rounded-md"
                    />
                    <p className='text-[#666] text-[11px]'>Use 8 or more characters with a mix of letters, numbers & symbols</p>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <input
                        type="confirm-password"
                        placeholder="Confirm password"
                        className="w-full border border-gray-300 p-3 rounded-md"
                    />
                </div>

                <div className="oath text-[12px]">
                    <p className='text-[#666]'>By creating an account, you agree to our <span className='text-[#111] underline cursor-pointer'>Terms of use</span> and <span className="text-[#111] underline cursor-pointer">Privacy Policy</span> </p>
                </div>

                {/* CAPTCHA */}
                <div className="flex items-center justify-between border border-gray-300 rounded-full p-3 w-[15rem] mt-7">
                    {/* Checkbox */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="not-robot"
                            className="mx-3 w-5 h-5 border-gray-400 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <label htmlFor="not-robot" className="text-sm font-medium text-gray-600">
                            I&apos;m not a robot
                        </label>
                    </div>
                    {/* reCAPTCHA Image */}
                    <img
                        src="./resources/google-recaptcha.png"
                        alt="reCAPTCHA"
                        className="h-8"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-[#5A05FF] text-white font-medium py-3 rounded-lg hover:bg-[#546791]"
                >
                    Create account
                </button>
            </form>
        </>
    );
};

export default RegisterComponent;
