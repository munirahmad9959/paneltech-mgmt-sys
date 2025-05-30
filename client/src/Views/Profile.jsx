import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createApiClient } from '../../Utils/Utils';
import { setUser } from '../state';
import PlayLoading from '../components/PlayLoading';



const Profile = ({ setShowSidebar, setNavDropDown }) => {
    const user = useSelector((state) => state.auth.user);
    const [initialLoad, setInitialLoad] = useState(true);
    const dispatch = useDispatch();
    const [expiryAlerts, setExpiryAlerts] = useState([]);

    const defaultUser = {
        _id: user.user?._id || '',
        fullName: user.user?.fullName || '',
        email: user.user?.email || '',
        dateOfBirth: user.user?.dateOfBirth || '',
        address: user.user?.address || '',
        cnic: user.user?.cnic || '',
        profileImage: user.user?.profileImage || './resources/noavatar.png',
        documents: {
            cnicDoc: user.employee?.cnicDoc || { path: "", uploadDate: null, expiryDate: null },
            cvDoc: user.employee?.cvDoc || { path: "", uploadDate: null, expiryDate: null }
        }
    };

    const [formData, setFormData] = useState({ ...defaultUser });
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);

    const ApiClient = createApiClient();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDocumentUpload = (docType, e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [docType]: file // This will be a File object until saved
                }
            }));
        }
    };

    const formatDateForInput = (isoDateString) => {
        if (!isoDateString) return '';
        const date = new Date(isoDateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file }));
            const reader = new FileReader();
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await ApiClient.get(`/user/${user.user?._id}`);
                const userData = response.data.data;
                console.log('Fetched user data:', userData);

                setFormData({
                    _id: userData.user?._id,
                    fullName: userData.user?.fullName,
                    email: userData.user?.email,
                    dateOfBirth: userData.user?.dateOfBirth || '',
                    address: userData.user?.address || '',
                    cnic: userData.user?.cnic || '',
                    profileImage: userData.user?.profileImage || './resources/noavatar.png',
                    documents: {
                        cnicDoc: userData.employee?.cnicDoc || null,
                        cvDoc: userData.employee?.cvDoc || null
                    }
                });

                dispatch(setUser({ user: userData, token: user.token }));

                // Check document expiry after setting the data
                checkDocumentExpiry(userData.employee);

                setInitialLoad(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setInitialLoad(false);
            }
        };

        const checkDocumentExpiry = (employeeData) => {
            if (!employeeData) return;

            const now = new Date();
            const alerts = [];

            // Check CNIC Doc expiry
            if (employeeData.cnicDoc?.expiryDate) {
                const expiryDate = new Date(employeeData.cnicDoc.expiryDate);
                const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

                if (now > expiryDate) {
                    alerts.push({
                        type: 'error',
                        message: 'Your CNIC document has expired. Please upload a new one.',
                        docType: 'cnicDoc'
                    });
                } else if (daysLeft <= 30) {
                    alerts.push({
                        type: 'warning',
                        message: `Your CNIC document will expire in ${daysLeft} day(s). Please renew it soon.`,
                        docType: 'cnicDoc'
                    });
                }
            }

            // Check CV Doc expiry
            if (employeeData.cvDoc?.expiryDate) {
                const expiryDate = new Date(employeeData.cvDoc.expiryDate);
                const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

                if (now > expiryDate) {
                    alerts.push({
                        type: 'error',
                        message: 'Your CV document has expired. Please upload a new one.',
                        docType: 'cvDoc'
                    });
                } else if (daysLeft <= 30) {
                    alerts.push({
                        type: 'warning',
                        message: `Your CV document will expire in ${daysLeft} day(s). Please renew it soon.`,
                        docType: 'cvDoc'
                    });
                }
            }

            setExpiryAlerts(alerts);
        };
        fetchUserData();
    }, [user.user?._id]);

    useEffect(() => {
        return () => {
            if (formData.profileImage instanceof File) {
                URL.revokeObjectURL(getProfileImageSrc());
            }
        };
    }, [formData.profileImage]);

    const handleSave = async () => {
        try {
            const payload = new FormData();
            payload.append('_id', user.user?._id);
            payload.append('fullName', formData.fullName);
            payload.append('email', formData.email);
            payload.append('dateOfBirth', formData.dateOfBirth);
            payload.append('address', formData.address);
            payload.append('cnic', formData.cnic);

            if (formData.profileImage && typeof formData.profileImage !== 'string') {
                payload.append('profileImage', formData.profileImage);
            }

            // Handle document uploads - backend will handle the structure
            if (formData.documents.cnicDoc instanceof File) {
                payload.append('cnicDoc', formData.documents.cnicDoc);
            } else if (typeof formData.documents.cnicDoc === 'object' && formData.documents.cnicDoc.path === "") {
                // Handle case where document was removed
                payload.append('cnicDoc', '');
            }

            if (formData.documents.cvDoc instanceof File) {
                payload.append('cvDoc', formData.documents.cvDoc);
            } else if (typeof formData.documents.cvDoc === 'object' && formData.documents.cvDoc.path === "") {
                // Handle case where document was removed
                payload.append('cvDoc', '');
            }

            const response = await ApiClient.post('/user/save', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const updatedUser = response.data.user;
            setFormData(prev => ({
                ...prev,
                dateOfBirth: updatedUser?.dateOfBirth || '',
                address: updatedUser?.address || '',
                cnic: updatedUser?.cnic || '',
                profileImage: updatedUser?.profileImage || null,
                documents: {
                    cnicDoc: updatedUser?.cnicDoc || { path: "", uploadDate: null, expiryDate: null },
                    cvDoc: updatedUser?.cvDoc || { path: "", uploadDate: null, expiryDate: null }
                }
            }));

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error updating profile. Please try again.');
        }
    };


    const triggerFileInput = () => {
        if (isEditing) {
            fileInputRef.current.click();
        }
    };

    const getProfileImageSrc = () => {
        if (!formData.profileImage) {
            return 'http://localhost:3000/uploads/noavatar.png';
        }

        if (typeof formData.profileImage === 'string') {
            return `http://localhost:3000${formData.profileImage}`;
        }

        if (formData.profileImage instanceof File) {
            return URL.createObjectURL(formData.profileImage);
        }

        return 'http://localhost:3000/uploads/noavatar.png';
    };

    const handleViewDocument = (doc) => {
        if (!doc) return;

        // If it's a File object (new upload)
        if (doc instanceof File) {
            window.open(URL.createObjectURL(doc), '_blank');
            return;
        }

        // If it's the document object from backend
        if (doc.path) {
            if (doc.path.startsWith('http') || doc.path.startsWith('blob')) {
                window.open(doc.path, '_blank');
            } else {
                window.open(`http://localhost:3000${doc.path}`, '_blank');
            }
            return;
        }
    };

    if (initialLoad) {
        return <PlayLoading />;
    }

    return (
        <div className="min-h-screen py-3 px-3 sm:px-6 lg:px-8" onClick={() => {
            setShowSidebar(false);
            setNavDropDown(false);
        }}
        >
            {expiryAlerts.length > 0 && (
                <div className="px-6 md:px-8 space-y-3">
                    {expiryAlerts.map((alert, index) => (
                        <div
                            key={index}
                            className={`${alert.type === 'error'
                                ? 'bg-red-100 border border-red-400 text-red-700'
                                : 'bg-amber-100 border border-amber-400 text-amber-700'} 
          px-4 py-3 rounded relative`}
                            role="alert"
                        >
                            <button
                                onClick={() => {
                                    setExpiryAlerts(prev => prev.filter((_, i) => i !== index));
                                }}
                                className="absolute top-1 right-1 px-2 py-1 text-lg font-medium hover:opacity-70"
                            >
                                &times;
                            </button>
                            <strong className="font-bold pr-6 block">
                                {alert.type === 'error' ? 'Expired Document! ' : 'Document Expiry Notice! '}
                            </strong>
                            <span className="block sm:inline pr-6">{alert.message}</span>
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        document.getElementById(alert.docType)?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="mt-2 text-sm font-medium underline"
                                >
                                    Update now →
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Header with Edit Button*/}
            < div className="p-3 flex justify-between items-center" >
                <div className='text-[#2b2a2a]'>
                    <h1 className="text-3xl font-bold ">Employee Profile</h1>
                    <p className="text-blue-600 opacity-90 pt-2">View and update your personal information</p>
                </div>
                {
                    !isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2 bg-green-400 hover:bg-[#04c866] text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            <span>Edit Profile</span>
                        </button>
                    ) : (
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2 bg-transparent border border-gray-200 text-red-500 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all duration-200 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 hover:bg-blue-100 cursor-pointer text-blue-600 rounded-lg font-medium bg-blue-50 transition-all duration-200 flex items-center space-x-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Save Changes</span>
                            </button>
                        </div>
                    )
                }
            </ div>

            {/* Main Content */}
            < div className="p-6 md:p-8" >
                {/* Profile Section */}
                < div className="flex flex-col md:flex-row items-start gap-8 mb-10" >
                    {/* Profile Image */}
                    < div className="w-full md:w-auto flex flex-col items-center" >


                        < div className={`relative w-40 h-40 rounded-full overflow-hidden border-4 ${isEditing ? 'border-blue-400 cursor-pointer' : 'border-none'} transition-all duration-300 ease-in-out group shadow-lg`}
                            onClick={triggerFileInput}
                        >
                            <img
                                src={getProfileImageSrc()}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'http://localhost:3000/uploads/noavatar.png';
                                }}
                            />
                            {
                                isEditing && (
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white font-medium flex flex-col items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Change Photo
                                        </span>
                                    </div>
                                )
                            }
                        </div >

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                            disabled={!isEditing}
                        />
                        <h2 className="mt-4 text-2xl font-bold text-gray-800">
                            {formData.firstName} {formData.lastName}
                        </h2>
                        <p className="text-gray-500">
                            {user.employee?.status
                                ?.split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ')}
                        </p>

                    </div >


                    {/* Personal Information */}
                    < div className="flex-1 w-full" >
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        disabled
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Date of Birth Field */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formatDateForInput(formData.dateOfBirth) || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEditing
                                            ? 'border border-gray-300 text-gray-700 bg-white'
                                            : 'border border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">CNIC</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="cnic"
                                        value={formData.cnic}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="XXXXX-XXXXXXX-X"
                                        className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEditing
                                            ? 'border border-gray-300 text-gray-700 bg-white'
                                            : 'border border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Field */}
                        <div className="mt-6 space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <div className="relative">
                                <textarea
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows={3}
                                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEditing
                                        ? 'border border-gray-300 text-gray-700 bg-white'
                                        : 'border border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed'
                                        }`}
                                />
                            </div>
                        </div>

                    </div >
                </div >

                {/* Document Upload Section */}
                < div className="mb-8" >
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Document Uploads</h3>

                    <div className="space-y-6">
                        {/* CNIC */}
                        <div id='cnicDoc'>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Passport</label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <label className={`flex-1 w-full cursor-pointer ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${(formData.documents.cnicDoc?.path && formData.documents.cnicDoc.path !== "") ||
                                        formData.documents.cnicDoc instanceof File
                                        ? 'border-green-300 bg-green-50 hover:border-green-400'
                                        : 'border-gray-400 hover:border-blue-400 bg-gray-50'
                                        }`}>
                                        {formData.documents.cnicDoc instanceof File ? (
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {formData.documents.cnicDoc.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {Math.round(formData.documents.cnicDoc.size / 1024)} KB
                                                </span>
                                            </div>
                                        ) : formData.documents.cnicDoc?.path && formData.documents.cnicDoc.path !== "" ? (
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-700">
                                                    Document uploaded
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Uploaded on: {new Date(formData.documents.cnicDoc.uploadDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        onChange={(e) => handleDocumentUpload('cnicDoc', e)}
                                        className="hidden"
                                        disabled={!isEditing}
                                        accept=".png,.jpg,.jpeg,.pdf"
                                    />
                                </label>
                                {(formData.documents.cnicDoc?.path || formData.documents.cnicDoc instanceof File) && (
                                    <button
                                        type="button"
                                        onClick={() => handleViewDocument(formData.documents.cnicDoc)}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                                    >
                                        View Document
                                    </button>
                                )}
                            </div>                        </div>

                        {/* CV */}
                        <div id='cvDoc'>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Curriculum Vitae (CV)</label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <label className={`flex-1 w-full cursor-pointer ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${(formData.documents.cvDoc?.path && formData.documents.cvDoc.path !== "") ||
                                        formData.documents.cvDoc instanceof File
                                        ? 'border-green-300 bg-green-50 hover:border-green-400'
                                        : 'border-gray-400 hover:border-blue-400 bg-gray-50'
                                        }`}>
                                        {formData.documents.cvDoc instanceof File ? (
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {formData.documents.cvDoc.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {Math.round(formData.documents.cvDoc.size / 1024)} KB
                                                </span>
                                            </div>
                                        ) : formData.documents.cvDoc?.path && formData.documents.cvDoc.path !== "" ? (
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-700">
                                                    Document uploaded
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Uploaded on: {new Date(formData.documents.cvDoc.uploadDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                                                <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        onChange={(e) => handleDocumentUpload('cvDoc', e)}
                                        className="hidden"
                                        disabled={!isEditing}
                                        accept=".pdf,.doc,.docx"
                                    />
                                </label>
                                {(formData.documents.cvDoc?.path || formData.documents.cvDoc instanceof File) && (
                                    <button
                                        type="button"
                                        onClick={() => handleViewDocument(formData.documents.cvDoc)}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                                    >
                                        View Document
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div >


            </div >
        </div >
    );
};

export default Profile;