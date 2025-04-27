import { useState, useRef } from 'react';

const EmployeeProfileView = ({ user }) => {
    const defaultUser = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '',
        address: '',
        cnic: '',
        profileImage: null,
        documents: {
            cnicFront: null,
            cnicBack: null,
            cv: null
        }
    };

    const [formData, setFormData] = useState({ ...defaultUser, ...user });
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle document uploads
    const handleDocumentUpload = (docType, e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [docType]: file
                }
            }));
        }
    };

    // Handle profile image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Save form data
    const handleSave = () => {
        // In a real app, you would send this data to your backend
        console.log('Saving data:', formData);
        setIsEditing(false);
        // Add your API call here
    };

    // Trigger file input when clicking on profile image
    const triggerFileInput = () => {
        if (isEditing) {
            fileInputRef.current.click();
        }
    };

    return (
        // <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F9FAFB]">
            {/* <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"> */}
            {/* Header */}
            {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <h1 className="text-2xl font-bold">Employee Profile</h1>
                    <p className="opacity-90">View and update your personal information</p>
                </div> */}

            {/* Profile Content */}
            <div className="p-6 md:p-8">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center mb-8">
                    <div
                        className={`relative w-32 h-32 rounded-full overflow-hidden border-4 ${isEditing ? 'border-blue-400 cursor-pointer' : 'border-gray-200'} transition-all duration-300 group`}
                        onClick={triggerFileInput}
                    >
                        {previewImage || formData.profileImage ? (
                            <img
                                src={previewImage || (typeof formData.profileImage === 'string' ? formData.profileImage : URL.createObjectURL(formData.profileImage))}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-4xl font-bold">
                                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                                </span>
                            </div>
                        )}
                        {isEditing && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-white font-medium">Change Photo</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                        disabled={!isEditing}
                    />
                    <h2 className="mt-4 text-xl font-semibold text-gray-800">
                        {formData.firstName} {formData.lastName}
                    </h2>
                    <p className="text-gray-600">Employee</p>
                </div>

                {/* Personal Information */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300 text-gray-700' : 'border-gray-200 bg-gray-100 text-gray-500'
                                    }`}
                            />
                        </div>

                        {/* CNIC/SSN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CNIC/SSN Number</label>
                            <input
                                type="text"
                                name="cnic"
                                value={formData.cnic}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="XXXXX-XXXXXXX-X"
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300 text-gray-700' : 'border-gray-200 bg-gray-100 text-gray-500'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                            rows={3}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300 text-gray-700' : 'border-gray-200 bg-gray-100 text-gray-500'
                                }`}
                        />
                    </div>
                </div>

                {/* Document Upload Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Document Uploads</h3>

                    <div className="space-y-6">
                        {/* CNIC Front */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CNIC/SSN Front</label>
                            <div className="flex items-center space-x-4">
                                <label className={`flex-1 cursor-pointer ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <div className={`border-2 border-dashed rounded-lg p-4 text-center ${formData.documents.cnicFront ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                                        } transition-colors duration-200`}>
                                        {formData.documents.cnicFront ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {formData.documents.cnicFront.name || 'Document uploaded'}
                                                </span>
                                            </div>
                                        ) : (
                                            <div>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
                                                <p className="mt-1 text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        onChange={(e) => handleDocumentUpload('cnicFront', e)}
                                        className="hidden"
                                        disabled={!isEditing}
                                        accept=".png,.jpg,.jpeg,.pdf"
                                    />
                                </label>
                                {formData.documents.cnicFront && (
                                    <button
                                        type="button"
                                        onClick={() => window.open(URL.createObjectURL(formData.documents.cnicFront), '_blank')}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                                    >
                                        View
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* CNIC Back */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CNIC/SSN Back</label>
                            <div className="flex items-center space-x-4">
                                <label className={`flex-1 cursor-pointer ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <div className={`border-2 border-dashed rounded-lg p-4 text-center ${formData.documents.cnicBack ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                                        } transition-colors duration-200`}>
                                        {formData.documents.cnicBack ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {formData.documents.cnicBack.name || 'Document uploaded'}
                                                </span>
                                            </div>
                                        ) : (
                                            <div>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
                                                <p className="mt-1 text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        onChange={(e) => handleDocumentUpload('cnicBack', e)}
                                        className="hidden"
                                        disabled={!isEditing}
                                        accept=".png,.jpg,.jpeg,.pdf"
                                    />
                                </label>
                                {formData.documents.cnicBack && (
                                    <button
                                        type="button"
                                        onClick={() => window.open(URL.createObjectURL(formData.documents.cnicBack), '_blank')}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                                    >
                                        View
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* CV */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum Vitae (CV)</label>
                            <div className="flex items-center space-x-4">
                                <label className={`flex-1 cursor-pointer ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <div className={`border-2 border-dashed rounded-lg p-4 text-center ${formData.documents.cv ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                                        } transition-colors duration-200`}>
                                        {formData.documents.cv ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {formData.documents.cv.name || 'Document uploaded'}
                                                </span>
                                            </div>
                                        ) : (
                                            <div>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
                                                <p className="mt-1 text-xs text-gray-500">PDF, DOCX up to 10MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        onChange={(e) => handleDocumentUpload('cv', e)}
                                        className="hidden"
                                        disabled={!isEditing}
                                        accept=".pdf,.doc,.docx"
                                    />
                                </label>
                                {formData.documents.cv && (
                                    <button
                                        type="button"
                                        onClick={() => window.open(URL.createObjectURL(formData.documents.cv), '_blank')}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                                    >
                                        View
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    // Reset form if needed
                                }}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                            >
                                Save Changes
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
        // </div>
        // </div>
    );
};

// Example usage:
// <EmployeeProfileView user={{ firstName: "John", lastName: "Doe" }} />

export default EmployeeProfileView;