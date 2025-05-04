// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createApiClient } from '../../Utils/Utils';

// const Payroll = () => {
//   const [activeTab, setActiveTab] = useState('current');
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [payrollData, setPayrollData] = useState(null);
//   const [historyData, setHistoryData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingHistory, setLoadingHistory] = useState(false);
//   const [error, setError] = useState(null);
//   const dispatch = useDispatch();
//   const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);

//   const token = useSelector((state) => state.auth.token);

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

//   const fetchCurrentPayroll = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const { data } = await ApiClient.get('/payroll/current', config);
//       setPayrollData(data);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPayrollHistory = async () => {
//     try {
//       setLoadingHistory(true);
//       setError(null);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           year: selectedYear
//         },
//       };
//       const { data } = await ApiClient.get('/payroll/history', config);
//       setHistoryData(data);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoadingHistory(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'current') {
//       fetchCurrentPayroll();
//     } else {
//       fetchPayrollHistory();
//     }
//   }, [activeTab, token, selectedYear]);

//   useEffect(() => {
//     if (activeTab === 'current') {
//       const fetchPayrollByPeriod = async () => {
//         try {
//           setLoading(true);
//           setError(null);
//           const config = {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           };
//           const { data } = await ApiClient.get(
//             `/payroll/${selectedMonth}/${selectedYear}`,
//             config
//           );
//           setPayrollData(data);
//         } catch (err) {
//           setError(err.response?.data?.message || err.message);
//           setPayrollData(null);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchPayrollByPeriod();
//     }
//   }, [selectedMonth, selectedYear, activeTab, token]);

//   if ((activeTab === 'current' && loading) || (activeTab === 'history' && loadingHistory)) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }


//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto p-4">
//         {/* Error Message - Displayed at the top if error exists */}
//         {error && (
//           <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//             <strong className="font-bold">Error! </strong>
//             <span className="block sm:inline">{error}</span>
//             <button
//               onClick={() => setError(null)}
//               className="absolute top-0 right-0 px-2 py-1"
//             >
//               <span className="text-red-700">×</span>
//             </button>
//           </div>
//         )}

//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Payroll</h1>
//             <p className="text-gray-600">View and manage your salary information</p>
//           </div>
//           <div className="flex space-x-2 mt-3 sm:mt-0">
//             <select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//               className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {months.map((month, index) => (
//                 <option key={month} value={index + 1}>{month}</option>
//               ))}
//             </select>
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//               className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {years.map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-200 mb-6">
//           <button
//             onClick={() => setActiveTab('current')}
//             className={`px-4 py-2 font-medium text-sm ${activeTab === 'current' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           >
//             Current Payroll
//           </button>
//           <button
//             onClick={() => setActiveTab('history')}
//             className={`px-4 py-2 font-medium text-sm ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           >
//             Payment History
//           </button>
//         </div>

//         {/* Current Payroll */}
//         {activeTab === 'current' && (
//           <>
//             {payrollData ? (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 {/* Summary Card */}
//                 <div className="bg-blue-50 p-4 border-b border-gray-200">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="font-medium text-gray-700">Payroll for {months[selectedMonth - 1]} {selectedYear}</h3>
//                       {payrollData.paymentDate && (
//                         <p className="text-sm text-gray-500">
//                           Payment date: {new Date(payrollData.paymentDate).toLocaleDateString()}
//                         </p>
//                       )}
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${payrollData.status === 'paid'
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                       {payrollData.status}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Payroll Details */}
//                 <div className="p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Earnings */}
//                     <div>
//                       <h4 className="font-medium text-gray-700 mb-3">Earnings</h4>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Basic Salary</span>
//                           <span className="font-medium">Rs. {payrollData?.basicSalary?.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Allowances</span>
//                           <span className="font-medium">Rs. {payrollData?.allowances?.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Bonuses</span>
//                           <span className="font-medium">Rs. {payrollData?.bonuses?.toLocaleString()}</span>
//                         </div>
//                         <div className="border-t border-gray-200 pt-2 mt-2">
//                           <div className="flex justify-between font-medium">
//                             <span>Total Earnings</span>
//                             <span>Rs. {(payrollData?.basicSalary + payrollData?.allowances + payrollData?.bonuses).toLocaleString()}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Deductions */}
//                     <div>
//                       <h4 className="font-medium text-gray-700 mb-3">Deductions</h4>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Tax (15%)</span>
//                           <span className="font-medium text-red-600">- Rs. {payrollData?.tax?.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Other Deductions</span>
//                           <span className="font-medium text-red-600">- Rs. {payrollData?.deductions?.toLocaleString()}</span>
//                         </div>
//                         <div className="border-t border-gray-200 pt-2 mt-2">
//                           <div className="flex justify-between font-medium">
//                             <span>Total Deductions</span>
//                             <span className="text-red-600">- Rs. {(payrollData.tax + payrollData.deductions)?.toLocaleString()}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Net Pay */}
//                   <div className="mt-6 pt-4 border-t border-gray-200">
//                     <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
//                       <span className="font-medium text-gray-700">Net Pay</span>
//                       <span className="text-2xl font-bold text-blue-600">
//                         Rs. {payrollData?.netPay?.toLocaleString()}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="mt-6 flex justify-end space-x-3">
//                     <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
//                       Download Payslip
//                     </button>
//                     <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700">
//                       Request Correction
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
//                 <p className="text-gray-500">No payroll data available for {months[selectedMonth - 1]} {selectedYear}</p>
//               </div>
//             )}
//           </>
//         )}

//         {/* Payment History */}
//         {activeTab === 'history' && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//             {historyData?.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Month
//                       </th>
//                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Basic Salary
//                       </th>
//                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Net Pay
//                       </th>
//                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Payment Date
//                       </th>
//                       <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {historyData.map((item, index) => (
//                       <tr key={index} className="hover:bg-gray-50">
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {months[item.month - 1]} {item.year}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           Rs. {item.basicSalary.toLocaleString()}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           Rs. {item.netPay.toLocaleString()}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap">
//                           <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                             }`}>
//                             {item.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {new Date(item.paymentDate).toLocaleDateString()}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
//                           <button className="text-blue-600 hover:text-blue-900 mr-3">
//                             View
//                           </button>
//                           <button className="text-blue-600 hover:text-blue-900">
//                             Download
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="p-6 text-center">
//                 <p className="text-gray-500">No payroll history available</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Payroll;

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createApiClient } from '../../Utils/Utils';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const Payroll = () => {
//   const [activeTab, setActiveTab] = useState('current');
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [payrollData, setPayrollData] = useState(null);
//   const [historyData, setHistoryData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingHistory, setLoadingHistory] = useState(false);
//   const [error, setError] = useState(null);
//   const dispatch = useDispatch();
//   const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);

//   const token = useSelector((state) => state.auth.token);
//   const user = useSelector((state) => state.auth.user);

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

//   const fetchCurrentPayroll = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const { data } = await ApiClient.get('/payroll/current', config);
//       setPayrollData(data);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPayrollHistory = async () => {
//     try {
//       setLoadingHistory(true);
//       setError(null);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           year: selectedYear
//         },
//       };
//       const { data } = await ApiClient.get('/payroll/history', config);
//       setHistoryData(data);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoadingHistory(false);
//     }
//   };

//   const fetchPayrollByPeriod = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const { data } = await ApiClient.get(
//         `/payroll/${selectedMonth}/${selectedYear}`,
//         config
//       );
//       setPayrollData(data);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//       setPayrollData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPayslip = () => {
//     if (!payrollData) return;

//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text('PAYSLIP', 105, 20, { align: 'center' });
//     doc.setFontSize(12);
//     doc.text(`Employee: ${user.user?.fullName}`, 14, 30);
//     doc.text(`Employee ID: ${user.user?._id}`, 14, 38);
//     doc.text(`Period: ${months[selectedMonth - 1]} ${selectedYear}`, 14, 46);
//     doc.text(`Payment Date: ${new Date().toLocaleDateString()}`, 14, 54);

//     // Earnings Table
//     autoTable(doc, {
//       startY: 60,
//       head: [['Earnings', 'Amount (Rs.)']],
//       body: [
//         [`Regular Hours (${payrollData.regularHours} hrs)`, payrollData.regularPay.toLocaleString()],
//         ...(payrollData.overtimeHours > 0 ? [
//           [`Overtime Hours (${payrollData.overtimeHours} hrs)`, payrollData.overtimePay.toLocaleString()]
//         ] : []),
//         ['Allowances', payrollData.allowances.toLocaleString()],
//         ['Total Earnings', (payrollData.regularPay + payrollData.overtimePay + payrollData.allowances).toLocaleString()]
//       ],
//       theme: 'grid'
//     });

//     // Deductions Table
//     autoTable(doc, {
//       startY: doc.lastAutoTable.finalY + 10,
//       head: [['Deductions', 'Amount (Rs.)']],
//       body: [
//         ['Tax', payrollData.tax.toLocaleString()],
//         ['Other Deductions', payrollData.deductions.toLocaleString()],
//         ['Total Deductions', (payrollData.tax + payrollData.deductions).toLocaleString()]
//       ],
//       theme: 'grid'
//     });

//     // Net Pay
//     doc.setFontSize(14);
//     doc.text(`Net Pay: Rs. ${payrollData.netPay.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 20);

//     doc.save(`Payslip_${user.user?.fullName}_${months[selectedMonth - 1]}_${selectedYear}.pdf`);
//   };

//   useEffect(() => {
//     if (activeTab === 'current') {
//       fetchCurrentPayroll();
//     } else {
//       fetchPayrollHistory();
//     }
//   }, [activeTab, token, selectedYear]);

//   useEffect(() => {
//     if (activeTab === 'current') {
//       fetchPayrollByPeriod();
//     }
//   }, [selectedMonth, selectedYear, activeTab, token]);

//   if ((activeTab === 'current' && loading) || (activeTab === 'history' && loadingHistory)) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto p-4">
//         {error && (
//           <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//             <strong className="font-bold">Error! </strong>
//             <span className="block sm:inline">{error}</span>
//             <button
//               onClick={() => setError(null)}
//               className="absolute top-0 right-0 px-2 py-1"
//             >
//               <span className="text-red-700">×</span>
//             </button>
//           </div>
//         )}

//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Payroll</h1>
//             <p className="text-gray-600">View and manage your salary information</p>
//           </div>
//           <div className="flex space-x-2 mt-3 sm:mt-0">
//             <select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//               className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {months.map((month, index) => (
//                 <option key={month} value={index + 1}>{month}</option>
//               ))}
//             </select>
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//               className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {years.map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex border-b border-gray-200 mb-6">
//           <button
//             onClick={() => setActiveTab('current')}
//             className={`px-4 py-2 font-medium text-sm ${activeTab === 'current' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           >
//             Current Payroll
//           </button>
//           <button
//             onClick={() => setActiveTab('history')}
//             className={`px-4 py-2 font-medium text-sm ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           >
//             Payment History
//           </button>
//         </div>

//         {activeTab === 'current' && (
//           <>
//             {payrollData ? (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="bg-blue-50 p-4 border-b border-gray-200">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="font-medium text-gray-700">Payroll for {months[selectedMonth - 1]} {selectedYear}</h3>
//                       {payrollData.paymentDate && (
//                         <p className="text-sm text-gray-500">
//                           Payment date: {new Date(payrollData.paymentDate).toLocaleDateString()}
//                         </p>
//                       )}
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${payrollData.status === 'paid'
//                       ? 'bg-green-100 text-green-800'
//                       : payrollData.status === 'pending'
//                         ? 'bg-yellow-100 text-yellow-800'
//                         : 'bg-red-100 text-red-800'
//                       }`}>
//                       {payrollData.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h4 className="font-medium text-gray-700 mb-3">Earnings</h4>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Regular Hours ({payrollData.regularHours} hrs)</span>
//                           <span className="font-medium">Rs. {payrollData.regularPay?.toLocaleString()}</span>
//                         </div>
//                         {payrollData.overtimeHours > 0 && (
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Overtime Hours ({payrollData.overtimeHours} hrs)</span>
//                             <span className="font-medium">Rs. {payrollData.overtimePay?.toLocaleString()}</span>
//                           </div>
//                         )}
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Allowances</span>
//                           <span className="font-medium">Rs. {payrollData.allowances?.toLocaleString()}</span>
//                         </div>
//                         <div className="border-t border-gray-200 pt-2 mt-2">
//                           <div className="flex justify-between font-medium">
//                             <span>Total Earnings</span>
//                             <span>Rs. {(payrollData.regularPay + payrollData.overtimePay + payrollData.allowances).toLocaleString()}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-medium text-gray-700 mb-3">Deductions</h4>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Tax ({Math.round((payrollData.tax / (payrollData.regularPay + payrollData.overtimePay + payrollData.allowances)) * 100)}%)</span>
//                           <span className="font-medium text-red-600">- Rs. {payrollData.tax?.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Other Deductions</span>
//                           <span className="font-medium text-red-600">- Rs. {payrollData.deductions?.toLocaleString()}</span>
//                         </div>
//                         <div className="border-t border-gray-200 pt-2 mt-2">
//                           <div className="flex justify-between font-medium">
//                             <span>Total Deductions</span>
//                             <span className="text-red-600">- Rs. {(payrollData.tax + payrollData.deductions)?.toLocaleString()}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-6 pt-4 border-t border-gray-200">
//                     <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
//                       <span className="font-medium text-gray-700">Net Pay</span>
//                       <span className="text-2xl font-bold text-blue-600">
//                         Rs. {payrollData.netPay?.toLocaleString()}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="mt-6 flex justify-end space-x-3">
//                     <button 
//                       onClick={downloadPayslip}
//                       className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//                     >
//                       Download Payslip
//                     </button>
//                     <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700">
//                       Request Correction
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
//                 <p className="text-gray-500">No payroll data available for {months[selectedMonth - 1]} {selectedYear}</p>
//               </div>
//             )}
//           </>
//         )}

//         {activeTab === 'history' && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//             {historyData?.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Month
//                       </th>
//                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Hours Worked
//                       </th>
//                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Net Pay
//                       </th>
//                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Payment Date
//                       </th>
//                       <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {historyData.map((item, index) => (
//                       <tr key={index} className="hover:bg-gray-50">
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {months[item.month - 1]} {item.year}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {item.totalHours} hrs
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           Rs. {item.netPay.toLocaleString()}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap">
//                           <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                             }`}>
//                             {item.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : 'N/A'}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
//                           <button className="text-blue-600 hover:text-blue-900 mr-3">
//                             View
//                           </button>
//                           <button className="text-blue-600 hover:text-blue-900">
//                             Download
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="p-6 text-center">
//                 <p className="text-gray-500">No payroll history available</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Payroll;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createApiClient } from '../../Utils/Utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';

const Payroll = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [payrollData, setPayrollData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const fetchCurrentPayroll = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await ApiClient.get('/payroll/current', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          emp_id: user.employee?._id
        }
      });
      console.log("Data for payroll inside the payroll employee side is:", data.payroll)
      
      if (data.success) {
        setPayrollData(data.payroll);
      } else {
        setError(data.message || "Failed to fetch current payroll");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch payroll data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayrollHistory = async () => {
    try {
      setLoadingHistory(true);
      setError(null);
      const { data } = await ApiClient.get('/payroll/history', {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          emp_id: user.employee?._id,
          year: selectedYear 
        }
      });
      
      if (data.success) {
        setHistoryData(data.history);
      } else {
        setError(data.message || "Failed to fetch payroll history");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchPayrollByPeriod = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await ApiClient.get(
        `/payroll/${selectedMonth}/${selectedYear}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          params: {
            emp_id: user.employee?._id
          }
        }
      );

      console.log("Data for payroll inside the payroll employee side is by period:", data.payroll)
      
      if (data.success) {
        setPayrollData(data.payroll);
      } else {
        setError(data.message || "No payroll data for selected period");
        setPayrollData(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch payroll");
      setPayrollData(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadPayslip = (payroll = payrollData) => {
    if (!payroll) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('PAYSLIP', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    
    // Employee and period info
    doc.text(`Employee: ${user.user?.fullName || 'N/A'}`, 14, 30);
    doc.text(`Employee ID: ${user?.employee?._id || 'N/A'}`, 14, 38);
    doc.text(`Period: ${months[payroll.month - 1]} ${payroll.year}`, 14, 46);
    doc.text(`Status: ${payroll.status.toUpperCase()}`, 14, 54);
    
    if (payroll.paymentDate) {
      doc.text(`Payment Date: ${moment(payroll.paymentDate).format('DD MMM YYYY')}`, 14, 62);
    }

    // Hourly Rate Information
    const employee = payroll.employeeId;
    if (employee) {
      doc.text(`Hourly Rate: Rs. ${formatCurrency(employee.hourlyRate)}`, 14, payroll.paymentDate ? 70 : 62);
      if (employee.overtimeRate) {
        doc.text(`Overtime Rate: ${employee.overtimeRate}x (Rs. ${formatCurrency(employee.hourlyRate * employee.overtimeRate)}/hr)`, 
          14, payroll.paymentDate ? 78 : 70);
      }
    }

    // Earnings Table
    autoTable(doc, {
      startY: payroll.paymentDate ? 86 : 78,
      head: [['Earnings', 'Hours', 'Rate', 'Amount (Rs.)']],
      body: [
        [
          'Regular Hours', 
          payroll.regularHours.toFixed(2), 
          formatCurrency(employee?.hourlyRate || 0), 
          formatCurrency(payroll.regularPay)
        ],
        ...(payroll.overtimeHours > 0 ? [
          [
            'Overtime Hours', 
            payroll.overtimeHours.toFixed(2), 
            formatCurrency((employee?.hourlyRate || 0) * (employee?.overtimeRate || 1.5)), 
            formatCurrency(payroll.overtimePay)
          ]
        ] : []),
        ['Allowances', '', '', formatCurrency(payroll.allowances)],
        ['Total Earnings', '', '', formatCurrency(
          payroll.regularPay + payroll.overtimePay + payroll.allowances
        )]
      ],
      theme: 'grid'
    });

    // Deductions Table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Deductions', 'Amount (Rs.)']],
      body: [
        ['Tax', formatCurrency(payroll.tax)],
        ['Other Deductions', formatCurrency(payroll.deductions)],
        ['Total Deductions', formatCurrency(payroll.tax + payroll.deductions)]
      ],
      theme: 'grid'
    });

    // Net Pay
    doc.setFontSize(14);
    doc.text(
      `Net Pay: Rs. ${formatCurrency(payroll.netPay)}`, 
      14, 
      doc.lastAutoTable.finalY + 20
    );

    doc.save(`Payslip_${user?.fullName || 'employee'}_${months[payroll.month - 1]}_${payroll.year}.pdf`);
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('en-PK', { maximumFractionDigits: 2 }) || '0';
  };

  const handleViewPayroll = (payroll) => {
    setSelectedMonth(payroll.month);
    setSelectedYear(payroll.year);
    setActiveTab('current');
    setPayrollData(payroll);
  };

  useEffect(() => {
    if (activeTab === 'current') {
      fetchCurrentPayroll();
    } else {
      fetchPayrollHistory();
    }
  }, [activeTab, token, selectedYear]);

  useEffect(() => {
    if (activeTab === 'current') {
      fetchPayrollByPeriod();
    }
  }, [selectedMonth, selectedYear, activeTab, token]);

  if ((activeTab === 'current' && loading) || (activeTab === 'history' && loadingHistory)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-4">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 right-0 px-2 py-1"
            >
              <span className="text-red-700">×</span>
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payroll</h1>
            <p className="text-gray-600">View your hourly-based salary information and payment history</p>
          </div>
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'current' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Current Payroll
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Payment History
          </button>
        </div>

        {activeTab === 'current' && (
          <>
            {payrollData ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-50 p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-700">
                        Payroll for {months[payrollData.month - 1]} {payrollData.year}
                      </h3>
                      {payrollData.paymentDate && (
                        <p className="text-sm text-gray-500">
                          Payment date: {moment(payrollData.paymentDate).format('DD MMM YYYY')}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payrollData.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : payrollData.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {payrollData.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  {/* Hourly Rate Summary */}
                  {payrollData.employeeId && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">Hourly Rates</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Regular Rate:</span>
                            <span className="font-medium">
                              Rs. {formatCurrency(payrollData.employeeId.hourlyRate)}/hr
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Overtime Rate:</span>
                            <span className="font-medium">
                              Rs. {formatCurrency(payrollData.employeeId.hourlyRate * (payrollData.employeeId.overtimeRate || 1.5))}/hr
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Earnings</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Regular Hours ({payrollData.regularHours.toFixed(2)} hrs)</span>
                          <span className="font-medium">Rs. {formatCurrency(payrollData.regularPay)}</span>
                        </div>
                        {payrollData.overtimeHours > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Overtime Hours ({payrollData.overtimeHours.toFixed(2)} hrs)</span>
                            <span className="font-medium">Rs. {formatCurrency(payrollData.overtimePay)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Allowances</span>
                          <span className="font-medium">Rs. {formatCurrency(payrollData.allowances)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total Earnings</span>
                            <span>
                              Rs. {formatCurrency(
                                payrollData.regularPay + 
                                payrollData.overtimePay + 
                                payrollData.allowances
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Deductions</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium text-red-600">- Rs. {formatCurrency(payrollData.tax)}</span>
                        </div>
                        {payrollData.deductions > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Other Deductions</span>
                            <span className="font-medium text-red-600">- Rs. {formatCurrency(payrollData.deductions)}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total Deductions</span>
                            <span className="text-red-600">
                              - Rs. {formatCurrency(payrollData.tax + payrollData.deductions)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-gray-700">Net Pay</span>
                      <span className="text-2xl font-bold text-blue-600">
                        Rs. {formatCurrency(payrollData.netPay)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button 
                      onClick={() => downloadPayslip(payrollData)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Download Payslip
                    </button>
                    {payrollData.status === 'pending' && (
                      <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700">
                        Request Correction
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-500">No payroll data available for {months[selectedMonth - 1]} {selectedYear}</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {historyData?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours Worked
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Earnings
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net Pay
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historyData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {months[item.month - 1]} {item.year}
                          </div>
                          {item.paymentDate && (
                            <div className="text-xs text-gray-500">
                              Paid on {moment(item.paymentDate).format('DD MMM YYYY')}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div>Regular: {item.regularHours.toFixed(2)} hrs</div>
                          {item.overtimeHours > 0 && (
                            <div>OT: {item.overtimeHours.toFixed(2)} hrs</div>
                          )}
                          <div>Total: {(item.regularHours + item.overtimeHours).toFixed(2)} hrs</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div>Regular: {formatCurrency(item.regularPay)}</div>
                          {item.overtimePay > 0 && (
                            <div>OT: {formatCurrency(item.overtimePay)}</div>
                          )}
                          <div>Total: {formatCurrency(item.regularPay + item.overtimePay + item.allowances)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          Rs. {formatCurrency(item.netPay)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : item.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleViewPayroll(item)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => downloadPayslip(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No payroll history available for {selectedYear}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;