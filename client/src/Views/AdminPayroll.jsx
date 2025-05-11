import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiSearch, FiEye, FiCheck, FiX, FiRefreshCw, FiUser
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import moment from 'moment';
import { createApiClient } from '../../Utils/Utils';
import { FiDownload } from 'react-icons/fi';
import * as ExcelJS from 'exceljs';


const AdminPayroll = ({ setShowSidebar, setNavDropDown }) => {
  const [activeTab, setActiveTab] = useState('processing');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [payrolls, setPayrolls] = useState([]);
  const [historyPayrolls, setHistoryPayrolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');

  const dispatch = useDispatch();
  const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);
  const token = useSelector((state) => state.auth.token);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const generateExcelReport = async (data, fileName) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Payroll Report');

      // Add headers
      worksheet.columns = [
        { header: 'Employee', key: 'employee', width: 30 },
        { header: 'Position', key: 'position', width: 20 },
        { header: 'Month', key: 'month', width: 15 },
        { header: 'Year', key: 'year', width: 10 },
        { header: 'Net Pay', key: 'netPay', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Payment Date', key: 'paymentDate', width: 20 }
      ];

      // Add data rows
      data.forEach(item => {
        worksheet.addRow({
          employee: item.user?.fullName || 'Unknown',
          position: item.employee?.position || 'N/A',
          month: months[item.month - 1],
          year: item.year,
          netPay: item.netPay,
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          paymentDate: item.paymentDate ? moment(item.paymentDate).format('YYYY-MM-DD') : 'N/A'
        });
      });

      // Style header row
      worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD3D3D3' }
        };
      });

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
      }, 100);

      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  const handleDownloadReport = async () => {
    try {
      setIsHistoryLoading(true);
      const response = await ApiClient.get('/payroll/hist-status', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const payrollData = response.data.payrolls || [];
      const fileName = `payroll-history-${moment().format('YYYY-MM-DD')}.xlsx`;
      await generateExcelReport(payrollData, fileName);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch payroll data');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleDownloadPeriodReport = async (month, year) => {
    try {
      setIsHistoryLoading(true);
      const response = await ApiClient.get('/payroll/hist-status', {
        headers: { Authorization: `Bearer ${token}` },
        params: { month, year }
      });

      const payrollData = response.data.payrolls || [];
      const fileName = `payroll-${months[month - 1]}-${year}.xlsx`;
      await generateExcelReport(payrollData, fileName);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch payroll data');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Fetch processing payroll data
  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        setIsLoading(true);
        const response = await ApiClient.get('/payroll/history', {
          headers: { Authorization: `Bearer ${token}` },
          params: { year: selectedYear }
        });
        setPayrolls(response.data.pendingPayrolls || []);
      } catch (error) {
        toast.error('Failed to fetch payroll data');
        console.error('Error fetching payrolls:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayrolls();
  }, [selectedYear, token]);

  // Fetch history payroll data when tab changes
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistoryPayrolls();
    }
  }, [activeTab]);

  const fetchHistoryPayrolls = async () => {
    try {
      setIsHistoryLoading(true);
      const response = await ApiClient.get('/payroll/history-status', {
        headers: { Authorization: `bearer ${token}` },
      });

      // The response data is already in the correct format (array of period groups)
      setHistoryPayrolls(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch payroll history');
      console.error('Error fetching payroll history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const filteredPayrolls = payrolls?.filter(payroll => {
    const matchesSearch = payroll.employeeId?.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.employeeId?.position?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMonth = payroll.month === selectedMonth;

    return matchesSearch && matchesMonth && payroll.status === 'pending';
  });

  // Handle payroll approval
  const handleApprove = async (payrollId) => {
    setShowDetailsModal(false);
    try {
      await ApiClient.put(
        `/payroll/${payrollId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Payroll approved successfully');
      setPayrolls(payrolls.map(p =>
        p._id === payrollId ? { ...p, status: 'approved', paymentDate: new Date().toISOString() } : p
      ));
      // Refresh history after approval
      if (activeTab === 'history') {
        fetchHistoryPayrolls();
      }
    } catch (error) {
      toast.error('Failed to approve payroll');
      console.error('Error approving payroll:', error);
    }
  };

  const filteredHistoryPayrolls = historyPayrolls?.filter(group => {
    if (!group) return false;

    const [monthName, yearStr] = group.period.split(' ');
    const groupYear = parseInt(yearStr);
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const groupMonth = monthNames.indexOf(monthName) + 1; // Convert to 1-12

    const matchesMonth = selectedMonth === '' || groupMonth === parseInt(selectedMonth);
    const matchesYear = selectedYear === '' || groupYear === parseInt(selectedYear);

    const matchesSearch = searchTerm === '';

    return matchesMonth && matchesYear && matchesSearch;
  });

  // Handle payroll rejection
  const handleReject = async (payrollId) => {
    try {
      await ApiClient.put(
        `/payroll/${payrollId}/reject`,
        { notes: rejectionNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Payroll rejected successfully');
      setPayrolls(payrolls.map(p =>
        p._id === payrollId ? { ...p, status: 'rejected', notes: rejectionNotes } : p
      ));
      setShowDetailsModal(false);
      setRejectionNotes('');
    } catch (error) {
      toast.error('Failed to reject payroll');
      console.error('Error rejecting payroll:', error);
    }
  };

  // View payroll details
  const viewPayrollDetails = (payroll) => {
    setSelectedPayroll(payroll);
    setShowDetailsModal(true);
  };

  // Format currency
  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //     minimumFractionDigits: 2
  //   }).format(amount || 0);
  // };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('en-OM', {
      style: 'currency',
      currency: 'OMR',
      maximumFractionDigits: 2
    }) || 'OMR 0.00';
  };


  // Get status badge
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      paid: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen" onClick={() => {
      setShowSidebar(false);
      setNavDropDown(false);
    }}>
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payroll Management</h1>
            <p className="text-gray-600">Process and manage employee payrolls</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('processing')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'processing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Processing
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Payment History
          </button>
        </div>

        {/* Loading state */}
        {(isLoading || (activeTab === 'history' && isHistoryLoading)) && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Processing Tab */}
        {!isLoading && activeTab === 'processing' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Pay
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayrolls?.length > 0 ? (
                    filteredPayrolls.map((payroll) => (
                      <tr key={payroll._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                              {payroll.employeeId?.userId?.profileImage ? (
                                <img
                                  src={`http://localhost:3000${payroll.employeeId?.userId?.profileImage}`}
                                  alt="Profile"
                                  className="h-full w-full object-cover rounded-full"
                                />
                              ) : (
                                <img src={`http://localhost:3000/uploads/noavatar.png`} alt='show pic' className='w-full h-full object-cover rounded-full' />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {payroll.employeeId?.userId?.fullName || 'Unknown Employee'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payroll.employeeId?.position || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payroll.employeeId?.position || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payroll.netPay)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payroll.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => viewPayrollDetails(payroll)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View Details"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(payroll._id)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Approve"
                            >
                              <FiCheck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPayroll(payroll);
                                setShowDetailsModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Reject"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No payrolls pending approval for {months[selectedMonth - 1]} {selectedYear}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* payment history */}
        {!isHistoryLoading && activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Payroll History</h2>
              <button
                onClick={handleDownloadReport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                <FiDownload className="mr-2" />
                Download Report
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Period
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees Paid
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Processed On
                    </th>
                    <th scope="col" className="px-9 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistoryPayrolls?.length > 0 ? (
                    filteredHistoryPayrolls.map((group) => (
                      <tr key={`${group.month}-${group.year}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {group.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {group.employeesPaid} {group.employeesPaid === 1 ? 'employee' : 'employees'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(group.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {moment(group.processedOn).format('MMM D, YYYY')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleDownloadPeriodReport(group.month, group.year)}
                              className="text-green-600 hover:text-green-900 flex items-center"
                              title="Download Report"
                            >
                              <FiDownload className="mr-1" /> Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No payroll history available for {selectedMonth ? months[selectedMonth - 1] : ''} {selectedYear || ''}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payroll Details Modal */}
        {showDetailsModal && selectedPayroll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Payroll Details - {selectedPayroll.employeeId?.userId?.fullName || 'Unknown Employee'}
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Employee Information</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-500">Name:</span> {selectedPayroll.employeeId?.userId?.fullName || 'N/A'}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Position:</span> {selectedPayroll.employeeId?.position || 'N/A'}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Employee ID:</span> {selectedPayroll.employeeId?._id || 'N/A'}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Hourly Rate:</span> {formatCurrency(selectedPayroll.employeeId?.hourlyRate)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Payroll Period</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-500">Month:</span> {months[selectedPayroll.month - 1]}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Year:</span> {selectedPayroll.year}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Status:</span> {getStatusBadge(selectedPayroll.status)}
                      </p>
                      {selectedPayroll.paymentDate && (
                        <p className="text-sm">
                          <span className="text-gray-500">Payment Date:</span> {moment(selectedPayroll.paymentDate).format('YYYY-MM-DD')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h4 className="font-medium text-gray-700 mb-4">Earnings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Regular Hours ({selectedPayroll.regularHours} hrs):</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedPayroll.regularPay)}</span>
                    </div>
                    {selectedPayroll.overtimeHours > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Overtime Hours ({selectedPayroll.overtimeHours} hrs):</span>
                        <span className="text-sm font-medium">{formatCurrency(selectedPayroll.overtimePay)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Allowances:</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedPayroll.allowances)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-sm font-medium text-gray-700">Gross Pay:</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(
                          selectedPayroll.regularPay +
                          selectedPayroll.overtimePay +
                          selectedPayroll.allowances
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h4 className="font-medium text-gray-700 mb-4">Deductions</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tax:</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedPayroll.tax)}</span>
                    </div>
                    {selectedPayroll.deductions > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Other Deductions:</span>
                        <span className="text-sm font-medium">{formatCurrency(selectedPayroll.deductions)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-sm font-medium text-gray-700">Total Deductions:</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(selectedPayroll.tax + selectedPayroll.deductions)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Net Pay:</span>
                    <span className="text-base font-bold text-blue-600">
                      {formatCurrency(selectedPayroll.netPay)}
                    </span>
                  </div>
                </div>

                {selectedPayroll.status === 'pending' && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-700 mb-3">Payroll Actions</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleApprove(selectedPayroll._id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm hover:bg-green-700 flex items-center justify-center"
                      >
                        <FiCheck className="mr-2" /> Approve Payroll
                      </button>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Notes</label>
                      <textarea
                        rows="3"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        placeholder="Enter reason for rejection..."
                        value={rejectionNotes}
                        onChange={(e) => setRejectionNotes(e.target.value)}
                      />
                      <button
                        onClick={() => handleReject(selectedPayroll._id)}
                        disabled={!rejectionNotes}
                        className={`mt-2 w-full bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700 flex items-center justify-center ${!rejectionNotes ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FiX className="mr-2" /> Reject Payroll
                      </button>
                    </div>
                  </div>
                )}

                {selectedPayroll.notes && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-medium text-gray-700 mb-1">Admin Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {selectedPayroll.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayroll;