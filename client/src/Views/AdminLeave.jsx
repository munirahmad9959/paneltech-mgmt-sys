import React, { useState, useEffect } from 'react';
import { FiFilter, FiX, FiCalendar, FiChevronDown, FiCheck, FiClock, FiAlertCircle, FiRefreshCw, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { createApiClient } from '../../Utils/Utils';
import { useDispatch, useSelector } from 'react-redux';

const AdminLeave = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);

  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    employeeName: ''
  });

  // Fetch leaves from backend
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.get('/leaves', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...(filters.status && { status: filters.status }),
          ...(filters.leaveType && { leaveType: filters.leaveType }),
          ...(filters.employeeName && { employeeName: filters.employeeName })
        }
      });
      console.log(`response for leaves from employee side: ${response.data.leaves}`); 

      setLeaves(response.data.leaves || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages || 1
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch leaves');
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [pagination.page, filters]);

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

  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];
  const leaveTypeOptions = ['All', 'annual', 'sick', 'maternity', 'paternity', 'other'];

  const handleStatusUpdate = async () => {
    if (!selectedLeave || !statusUpdate) return;
    
    try {
      await ApiClient.put(`/leaves/${selectedLeave._id}/status`, 
        { status: statusUpdate },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setShowStatusModal(false);
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update leave status');
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leave Management - Admin</h1>
        <p className="text-gray-600">Review and manage employee leave requests</p>
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
          { label: "Total Leaves", value: leaves.length, icon: <FiCalendar className="text-gray-500" />, color: "bg-white border border-gray-200" },
          { label: "Approved Leaves", value: leaves.filter(l => l.status === 'Approved').length, icon: <FiCheck className="text-blue-500" />, color: "bg-white border border-blue-200" },
          { label: "Rejected Leaves", value: leaves.filter(l => l.status === 'Rejected').length, icon: <FiX className="text-red-500" />, color: "bg-white border border-red-200" },
          { label: "Pending Requests", value: leaves.filter(l => l.status === 'Pending').length, icon: <FiClock className="text-yellow-500" />, color: "bg-white border border-yellow-200" },
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
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3">
          <button
            onClick={fetchLeaves}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.employeeName}
                  onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
                  placeholder="Search by name"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setFilters({ status: '', leaveType: '', employeeName: '' })}
                  className="text-sm text-gray-600 hover:text-gray-800 mr-3"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setShowFilters(false);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
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
                  {["Employee", "Type", "From", "To", "Days", "Status", "Actions"].map((header) => (
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
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {/* <FiUser className="text-gray-500" /> */}
                          <img src={`http://localhost:3000${leave.employeeId?.profileImage}`} alt="show pic" className='w-full h-full object-cover rounded-full'/>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {leave.employeeId?.fullName || 'Unknown Employee'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {leave.employeeId?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
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
                      {calculateDays(leave.startDate, leave.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[leave.status]}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {leave.status === 'Pending' && (
                        <button
                          onClick={() => {
                            setSelectedLeave(leave);
                            setShowStatusModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leaves.length === 0 && !loading && (
            <div className="p-8 text-center">
              <FiAlertCircle className="mx-auto text-gray-400 text-4xl mb-2" />
              <p className="text-gray-500">No leave requests found</p>
            </div>
          )}

          {/* Pagination */}
          {leaves.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                    <span className="font-medium">{pagination.totalPages}</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-4 py-2 border rounded-md ${pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`px-4 py-2 border rounded-md ${pagination.page === pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedLeave && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Update Leave Status</h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Employee: <span className="font-medium">{selectedLeave.employeeId?.fullName || 'Unknown'}</span></p>
                <p className="text-sm text-gray-600 mb-2">Leave Type: <span className="font-medium capitalize">{selectedLeave.leaveType}</span></p>
                <p className="text-sm text-gray-600 mb-2">Dates: <span className="font-medium">{formatDate(selectedLeave.startDate)} to {formatDate(selectedLeave.endDate)}</span></p>
                <p className="text-sm text-gray-600 mb-4">Reason: <span className="font-medium">{selectedLeave.reason}</span></p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStatusUpdate('Approved')}
                    className={`px-4 py-2 rounded-lg border ${statusUpdate === 'Approved' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-300 text-gray-700'}`}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusUpdate('Rejected')}
                    className={`px-4 py-2 rounded-lg border ${statusUpdate === 'Rejected' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-white border-gray-300 text-gray-700'}`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  disabled={!statusUpdate}
                  className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${!statusUpdate ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}`}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLeave;