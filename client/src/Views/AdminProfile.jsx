import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createApiClient } from '../../Utils/Utils';
import { setUser } from '../state';
import PlayLoading from '../Components/PlayLoading';


const AdminProfile = ({setShowSidebar, setNavDropDown}) => {
  const user = useSelector((state) => state.auth.user);
  const [initialLoad, setInitialLoad] = useState(true);
  const dispatch = useDispatch();

  const defaultUser = {
    _id: user.user?._id || '',
    fullName: user.user?.fullName || '',
    email: user.user?.email || '',
    dateOfBirth: user.user?.dateOfBirth || '',
    address: user.user?.address || '',
    cnic: user.user?.cnic || '',
    profileImage: user.user?.profileImage || './resources/noavatar.png',
  };

  const [formData, setFormData] = useState({ ...defaultUser });
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [handleSaveClicked, setHandleSaveClicked] = useState(true)
  const fileInputRef = useRef(null);

  const ApiClient = createApiClient();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const formatDateForInput = (isoDateString) => {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

        setFormData({
          _id: userData.user?._id,
          fullName: userData.user?.fullName,
          email: userData.user?.email,
          dateOfBirth: userData.user?.dateOfBirth || '',
          address: userData.user?.address || '',
          cnic: userData.user?.cnic || '',
          profileImage: userData.user?.profileImage || './resources/noavatar.png',
        });

        dispatch(setUser({ user: userData, token: user.token }));

        setInitialLoad(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setInitialLoad(false);
      }
    };

    fetchUserData();
  }, [user.user?._id]);

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

  if (initialLoad) {
    return <PlayLoading />;
  }

  return (
    <div className="min-h-screen py-3 px-3 sm:px-6 lg:px-8" onClick={() => {
      setShowSidebar(false);
      setNavDropDown(false);
    }}>
      {/* Header with Edit Button*/}
      <div className="p-3 flex justify-between items-center">
        <div className='text-[#2b2a2a]'>
          <h1 className="text-3xl font-bold ">Admin Profile</h1>
          <p className="text-blue-600 opacity-90 pt-2">View and update your personal information</p>
        </div>
        {!isEditing ? (
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
        )}
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-10">
          {/* Profile Image */}
          <div className="w-full md:w-auto flex flex-col items-center">
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

          </div>


          {/* Personal Information */}
          <div className="flex-1 w-full">
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
                <label className="block text-sm font-medium text-gray-700">CNIC/SSN Number</label>
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;