import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading, setLogin } from '../state';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { ApiClient } from '../../Utils';

const LoginComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        dispatch(setLoading(true));
        try {
            const response = await ApiClient.post("/auth/login", data);
            dispatch(setLogin({
                user: response.data.user,
                token: response.data.token,
            }));
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed! Please try again.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 md:mt-7">Log in</h2>
            <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {/* Email Address */}
                <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter email address"
                        className={`w-full border p-3 rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: 'Invalid email address',
                            },
                        })}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        className={`w-full border p-3 rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 6 characters long',
                            },
                        })}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full bg-[#5104e5] text-white font-medium py-3 rounded-lg hover:bg-[#4003b7] cursor-pointer">
                    Log in
                </button>

                <div className="text-sm text-gray-600 text-center mt-3">
                    Don’t have an account? <span className="text-[#5A05FF] cursor-pointer" onClick={() => navigate('/register')}>Sign up</span>
                </div>

                {/* Social Login */}
                <div className="separator h-[1px] bg-gray-400 my-5" />
                <div className="text-center text-sm text-gray-600">or continue with</div>
                <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        type="button"
                        className="flex items-center justify-center w-full bg-white text-gray-600 py-2 focus:ring-4 focus:ring-red-300 rounded-full border border-gray-600 shadow-md hover:bg-[#efe5ff] cursor-pointer"
                    >
                        <FcGoogle className="mr-2 text-xl" />
                        Google
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center w-full bg-white text-gray-600 py-2 focus:ring-4 focus:ring-blue-300 rounded-full border border-gray-600 shadow-md hover:bg-[#efe5ff] cursor-pointer"
                    >
                        <FaFacebook className="mr-2 text-blue-700 text-xl" />
                        Facebook
                    </button>
                </div>
            </form>
        </>
    );
};

export default LoginComponent;

