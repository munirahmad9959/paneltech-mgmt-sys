import React, { useState, useEffect } from 'react';
import { FiFilter, FiX, FiCalendar, FiChevronDown, FiCheck, FiClock, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { format } from 'date-fns';
import { createApiClient } from '../../Utils/Utils';
import { useDispatch, useSelector } from 'react-redux';


const LeaveMgmt = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableLeaves, setAvailableLeaves] = useState(10);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);

  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
  });

  // Fetch leaves from backend
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.get('/leaves', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Handle different response structures
      const receivedLeaves = Array.isArray(response.data)
        ? response.data
        : (response.data?.leaves || []);

      setLeaves(receivedLeaves);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch leaves');
      setLeaves([]); // Ensure we always have an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-600",
    Approved: "bg-green-100 text-green-600",
    Rejected: "bg-red-100 text-red-600",
  };

  const leaveTypeColors = {
    annual: "bg-blue-100 text-blue-600",
    sick: "bg-purple-100 text-purple-600",
    maternity: "bg-pink-100 text-pink-600",
    paternity: "bg-teal-100 text-teal-600",
    other: "bg-gray-100 text-gray-600",
  };

  const filteredLeaves = Array.isArray(leaves)
    ? leaves.filter(leave => {
      return (
        (filters.status === '' || leave.status === filters.status) &&
        (filters.leaveType === '' || leave.leaveType === filters.leaveType)
      );
    })
    : [];

  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];
  const leaveTypeOptions = ['All', 'annual', 'sick', 'maternity', 'paternity', 'other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    try {
      await ApiClient.post('/leaves/apply', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAvailableLeaves(prev => Math.max(0, prev - 1)); // Ensure it doesn't go below 0

      setShowModal(false);
      fetchLeaves(); // Refresh the list
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit leave request');
    }
  };

  const handleCancelLeave = async (id) => {
    try {
      await ApiClient.delete(`/leaves/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAvailableLeaves(prev => Math.min(10, prev + 1)); // Ensure it doesn't exceed 10

      fetchLeaves(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel leave');
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
        <p className="text-gray-600">Manage your leave requests and balances</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="float-right">
            <FiX />
          </button>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Available Leaves", value: availableLeaves, icon: <FiCheck className="text-green-500" />, color: "bg-white border border-green-200" },
          { label: "Approved Leaves", value: filteredLeaves.filter(l => l.status === 'Approved').length, icon: <FiCheck className="text-blue-500" />, color: "bg-white border border-blue-200" },
          { label: "Rejected Leaves", value: filteredLeaves.filter(l => l.status === 'Rejected').length, icon: <FiX className="text-red-500" />, color: "bg-white border border-red-200" },
          { label: "Pending Requests", value: filteredLeaves.filter(l => l.status === 'Pending').length, icon: <FiClock className="text-yellow-500" />, color: "bg-white border border-yellow-200" },
        ].map((card) => (
          <div key={card.label} className={`p-4 rounded-xl shadow-sm ${card.color} flex items-center`}>
            <div className="p-3 rounded-lg bg-opacity-20 mr-4">
              {card.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
              <p className="text-sm text-gray-600">{card.label}</p>
            </div>
          </div>
        ))}
      </div>      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-300 flex items-center"
          >
            <FiCalendar className="mr-2" />
            Apply Leave
          </button>
          <button
            onClick={fetchLeaves}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition duration-300 flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 transition duration-300 flex items-center"
          >
            <FiFilter className="mr-2" />
            Filter
            <FiChevronDown className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10 p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value === 'All' ? '' : e.target.value })}
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.leaveType}
                  onChange={(e) => setFilters({ ...filters, leaveType: e.target.value === 'All' ? '' : e.target.value })}
                >
                  {leaveTypeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setFilters({ status: '', leaveType: '' })}
                  className="text-sm text-gray-600 hover:text-gray-800 mr-3"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Type", "From", "To", "Days", "Status", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeaves.map((leave) => {
                  const startDate = new Date(leave.startDate);
                  const endDate = new Date(leave.endDate);
                  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

                  return (
                    <tr key={leave._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${leaveTypeColors[leave.leaveType]}`}>
                          {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(leave.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(leave.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {days}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[leave.status]}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {leave.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelLeave(leave._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLeaves.length === 0 && !loading && (
            <div className="p-8 text-center">
              <FiAlertCircle className="mx-auto text-gray-400 text-4xl mb-2" />
              <p className="text-gray-500">No leave requests found</p>
            </div>
          )}
        </div>
      )}

      {/* Leave Application Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Apply for Leave</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitLeave}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select leave type</option>
                    <option value="annual">Annual Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="maternity">Maternity Leave</option>
                    <option value="paternity">Paternity Leave</option>
                    <option value="other">Other Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    rows={4}
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Briefly explain the reason for your leave"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveMgmt;