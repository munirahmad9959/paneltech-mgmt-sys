import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApiClient } from '../../Utils/Utils';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

const EmployeeListView = ({ setShowSidebar, setNavDropDown }) => {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ ...employees });
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await ApiClient.get('/employees', {
                headers: { Authorization: `bearer ${token}` }
            });
            setEmployees(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch employees');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [token, ApiClient]);

    const filteredEmployees = employees.filter(employee =>
        employee.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleActionButtonClick = (employee, e) => {
        e.stopPropagation();
        setSelectedEmployee(employee);
        setFormData({
            department: employee.department || '',
            position: employee.position || '',
            status: employee.status || 'active',
            hourlyRate: employee.hourlyRate || 0,
            joiningDate: employee.joiningDate?.split('T')[0] || '',
            taxInfo: {
                taxId: employee.taxInfo?.taxId || '',
                taxRate: employee.taxInfo?.taxRate || 0.15
            },
            bankDetails: {
                accountNumber: employee.bankDetails?.accountNumber || '',
                bankName: employee.bankDetails?.bankName || '',
                branch: employee.bankDetails?.branch || '',
                accountType: employee.bankDetails?.accountType || ''
            },
            allowances: employee.allowances || 0,
            deductions: employee.deductions || 0,
            overtimeRate: employee.overtimeRate || 1.5,
            standardHours: employee.standardHours || 160
        });
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await ApiClient.put(`/employees/${selectedEmployee.user._id}`, formData, {
                headers: { Authorization: `bearer ${token}` }
            });

            await fetchEmployees();

            toast.success('Employee profile updated successfully');
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Failed to update employee profile');
            console.error('Error:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8" onClick={() => {
            setShowSidebar(false);
            setNavDropDown(false);
        }}>
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedEmployee?.profileStatus === 'incomplete'
                                        ? 'Complete Employee Profile'
                                        : 'Edit Employee Profile'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Personal Info */}
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={selectedEmployee?.user.fullName || ''}
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={selectedEmployee?.user.email || ''}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bank Details */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Bank Details</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                                    <input
                                                        type="text"
                                                        name="bankDetails.bankName"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={formData.bankDetails?.bankName || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                                    <input
                                                        type="text"
                                                        name="bankDetails.accountNumber"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={formData.bankDetails?.accountNumber || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                                                    <input
                                                        type="text"
                                                        name="bankDetails.accountType"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={formData.bankDetails?.accountType || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Employment Info */}
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Employment Details</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                                    <input
                                                        type="text"
                                                        name="department"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={formData.department || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                                    <input
                                                        type="text"
                                                        name="position"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={formData.position || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                    <select
                                                        name="status"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={formData.status || 'active'}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                        <option value="on leave">On Leave</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                                                    <input
                                                        type="date"
                                                        name="joiningDate"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={formData.joiningDate || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Compensation */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Compensation</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (OMR)</label>
                                                    <input
                                                        type="number"
                                                        name="hourlyRate"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={formData.hourlyRate || 0}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Rate (x)</label>
                                                    <input
                                                        type="number"
                                                        name="overtimeRate"
                                                        min="1"
                                                        step="0.1"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={formData.overtimeRate || 1.5}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Standard Hours</label>
                                                    <input
                                                        type="number"
                                                        name="standardHours"
                                                        min="0"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={formData.standardHours || 160}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                                    >
                                        {saving ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </span>
                                        ) : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
                    <p className="text-gray-600 mt-1">View and manage all employee profiles</p>
                </div>
                <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {/* Grid Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <div className="col-span-3">Employee</div>
                        <div className="col-span-2">Email</div>
                        <div className="col-span-2">Department</div>
                        <div className="col-span-2">Position</div>
                        <div className="col-span-1 text-center">Status</div>
                        <div className="col-span-1 text-center">Profile</div>
                        <div className="col-span-1 text-center">Actions</div>
                    </div>

                    {/* Grid Rows */}
                    <div className="divide-y divide-gray-100">
                        {filteredEmployees.map((employee) => (
                            <div
                                key={employee.user._id}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 py-4 md:px-6 hover:bg-gray-50 transition"
                            >
                                {/* Employee */}
                                <div
                                    className="md:col-span-3 flex items-center gap-3"
                                >

                                    {employee?.user?.profileImage ? (
                                        <img src={`http://localhost:3000${employee?.user?.profileImage}`} alt='show pic' className='w-10 h-10 object-cover rounded-full' />
                                    ) : (<img src={`http://localhost:3000/uploads/noavatar.png`} alt='show pic' className='w-10 h-10 object-cover rounded-full' />)}

                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {employee.user.fullName}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            ID: {employee.user._id}
                                        </p>
                                        <p className="md:hidden text-xs text-gray-500 mt-1">
                                            {employee.user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div
                                    className="hidden md:flex md:col-span-2 text-sm text-gray-500 items-center cursor-pointer"
                                    onClick={() => handleEmployeeClick(employee.user._id)}
                                >
                                    {employee.user.email}
                                </div>

                                {/* Department */}
                                <div className="md:col-span-2">
                                    <div className="md:hidden text-xs text-gray-500 mb-1">Department</div>
                                    <div
                                        className="text-sm text-gray-700 cursor-pointer"
                                        onClick={() => handleEmployeeClick(employee.user._id)}
                                    >
                                        {employee.department || '-'}
                                    </div>
                                </div>

                                {/* Position */}
                                <div className="md:col-span-2">
                                    <div className="md:hidden text-xs text-gray-500 mb-1">Position</div>
                                    <div
                                        className="text-sm text-gray-700 cursor-pointer"
                                        onClick={() => handleEmployeeClick(employee.user._id)}
                                    >
                                        {employee.position || '-'}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="md:col-span-1 text-center">
                                    <span
                                        className={`cursor-pointer inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${employee.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : employee.status === 'inactive'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                    >
                                        {employee.status}
                                    </span>
                                </div>

                                {/* Profile */}
                                <div className="md:col-span-1 text-center">
                                    <span
                                        className={`cursor-pointer inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${employee.profileStatus === 'complete'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {employee.profileStatus}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="md:col-span-1 text-center">
                                    <button
                                        onClick={(e) => handleActionButtonClick(employee, e)}
                                        className={`cursor-pointer px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${employee.profileStatus === 'incomplete'
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {employee.profileStatus === 'incomplete' ? 'Complete' : 'Edit'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            )}
        </div>
    );
};

export default EmployeeListView;