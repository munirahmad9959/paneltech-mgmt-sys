// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { useDispatch } from 'react-redux';
// import { setLogin } from '../state';
// import { useNavigate } from 'react-router-dom';
// import { FaFacebook } from "react-icons/fa";
// import { FcGoogle } from 'react-icons/fc';
// import { setLoading } from '../state';
// // import { ApiClient } from '../../utils';
// import { toast } from 'react-toastify';
// import { ToastContainer } from 'react-toastify';


// const LoginComponent = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { register, handleSubmit, formState: { errors } } = useForm();

//     const onSubmit = async (data) => {
//         dispatch(setLoading(true));
//         try {
//             const response = await ApiClient.post("/Auth/login", data);
//             dispatch(setLogin({
//                 user: response.data.user,
//                 token: response.data.token,
//             }));
//             navigate("/dashboard");
//         } catch (error) {
//             console.error("Login error:", error);
//             toast.error(error.response?.data?.message || "Login failed! Please try again.");
//         } finally {
//             dispatch(setLoading(false));
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-[#FFF] md:mt-24 px-4 sm:px-6 md:px-8">
//             <ToastContainer position="top-right" autoClose={3000} />
//             <div className="logincard flex flex-col md:flex-row max-w-4xl w-full rounded-2xl overflow-hidden shadow-lg">
//                 {/* Left Side with Image */}
//                 <div className="hidden md:block md:w-1/2">
//                     <img src="./resources/login-image.png" height={310} alt="login" className="w-full h-full object-cover" />
//                 </div>

//                 {/* Right Side with Form */}
//                 <div className="w-full md:w-1/2 text-gray-700 bg-white flex items-center justify-center px-6 py-10 sm:px-10">
//                     <form
//                         className="w-full max-w-sm space-y-5"
//                         onSubmit={handleSubmit(onSubmit)}
//                     >
//                         <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">Login</h2>

//                         {/* Email Field */}
//                         <div>
//                             <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 className={`w-full bg-gray-50 text-black rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 p-2.5`}
//                                 placeholder="username@email.com"
//                                 {...register('email', {
//                                     required: 'Email is required',
//                                     pattern: {
//                                         value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                                         message: 'Invalid email address',
//                                     },
//                                 })}
//                             />
//                             {errors.email && (
//                                 <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//                             )}
//                         </div>

//                         {/* Password Field */}
//                         <div>
//                             <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 className={`w-full bg-gray-50 text-black rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 p-2.5`}
//                                 placeholder="Enter your password"
//                                 {...register('password', {
//                                     required: 'Password is required',
//                                     minLength: {
//                                         value: 6,
//                                         message: 'Password must be at least 6 characters long',
//                                     },
//                                 })}
//                             />
//                             {errors.password && (
//                                 <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//                             )}
//                         </div>

//                         {/* Submit Button */}
//                         <button
//                             type="submit"
//                             className="w-full bg-[#5A05FF] text-white py-2 rounded-lg hover:bg-[#546791] focus:ring-4 focus:ring-blue-300"
//                         >
//                             Submit
//                         </button>

//                         <div className="separator h-[1px] bg-gray-400 my-5" />
//                         <div className="text-center text-sm text-gray-600">or continue with</div>

//                         {/* Social Media Buttons */}
//                         <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
//                             <button
//                                 type="button"
//                                 className="flex items-center justify-center w-full bg-white text-gray-600 py-2 focus:ring-4 focus:ring-red-300 rounded-full border border-gray-600 shadow-md hover:bg-[#efe5ff]"
//                             >
//                                 <FcGoogle className="mr-2 text-xl" />
//                                 Google
//                             </button>
//                             <button
//                                 type="button"
//                                 className="flex items-center justify-center w-full bg-white text-gray-600 py-2 focus:ring-4 focus:ring-blue-300 rounded-full border border-gray-600 shadow-md hover:bg-[#efe5ff]"
//                             >
//                                 <FaFacebook className="mr-2 text-blue-700 text-xl" />
//                                 Facebook
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginComponent;

import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading, setLogin } from '../state';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
// import { ApiClient } from '../../utils';

const LoginComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        dispatch(setLoading(true));
        try {
            // const response = await ApiClient.post("/Auth/login", data);
            // dispatch(setLogin({
            //     user: response.data.user,
            //     token: response.data.token,
            // }));
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
                                value: 6,
                                message: 'Password must be at least 6 characters long',
                            },
                        })}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full bg-[#5A05FF] text-white font-medium py-3 rounded-lg hover:bg-[#546791]">
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
                        className="flex items-center justify-center w-full bg-white text-gray-600 py-2 focus:ring-4 focus:ring-red-300 rounded-full border border-gray-600 shadow-md hover:bg-[#efe5ff]"
                    >
                        <FcGoogle className="mr-2 text-xl" />
                        Google
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center w-full bg-white text-gray-600 py-2 focus:ring-4 focus:ring-blue-300 rounded-full border border-gray-600 shadow-md hover:bg-[#efe5ff]"
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

