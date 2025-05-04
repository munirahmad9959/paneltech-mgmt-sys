import React, { useEffect, useState, useMemo } from 'react'
import { createApiClient } from '../../Utils/Utils'
import { useSelector, useDispatch } from 'react-redux'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import autoTable from 'jspdf-autotable'

const AdminAttendance = () => {
  const dispatch = useDispatch()
  const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    fetchAttendanceRecords()
  }, [])

  const downloadAttendance = (record) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee Attendance Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Employee Name: ${record.fullName}`, 14, 30);
    doc.text(`Employee ID: ${record.employeeId}`, 14, 38);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 46);

    const tableColumn = ["Date", "Check-in", "Check-out", "Total Hours"];
    const tableRows = [
      [
        formatDate(record.date),
        record.checkIn ? formatTime(record.checkIn) : "N/A",
        record.checkOut ? formatTime(record.checkOut) : "N/A",
        record.totalHours.toFixed(2) + " hrs",
      ]
    ];

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
    });

    doc.save(`${record.fullName}_Attendance_Report.pdf`);
  };

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await ApiClient.get('/attendance', config)
      console.log('Attendance Records:', response.data.attendanceRecords)
      setRecords(response.data.attendanceRecords)
    } catch (err) {
      console.error('Failed to fetch attendance records:', err)
      setError('Failed to load attendance records. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredRecords = records.filter(record =>
    record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Employee Attendance Records</h1>
          <p className="text-gray-600 mt-2">View and manage all employee attendance data</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search by name or employee ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <button
              onClick={fetchAttendanceRecords}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            // <div className="overflow-x-auto">
            //   <table className="min-w-full divide-y divide-gray-200">
            //     <thead className="bg-gray-50">
            //       <tr>
            //         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            //           Employee
            //         </th>
            //         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            //           Date
            //         </th>
            //         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            //           Check In
            //         </th>
            //         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            //           Check Out
            //         </th>
            //         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            //           Total Hours
            //         </th>
            //       </tr>
            //     </thead>
            //     <tbody className="bg-white divide-y divide-gray-200">
            //       {filteredRecords.length > 0 ? (
            //         filteredRecords.map((record) => (
            //           <tr key={`${record.employeeId}-${record.date}`} className="hover:bg-gray-50">
            //             <td className="px-6 py-4 whitespace-nowrap">
            //               <div className="flex items-center">
            //                 <div className="flex-shrink-0 h-10 w-10">
            //                   <img
            //                     className="h-10 w-10 rounded-full object-cover"
            //                     src={`http://localhost:3000${record.profilePicture}` || 'https://via.placeholder.com/40'}
            //                     alt=""
            //                   />
            //                 </div>
            //                 <div className="ml-4">
            //                   <div className="text-sm font-medium text-gray-900">{record.fullName}</div>
            //                   <div className="text-sm text-gray-500">ID: {record.employeeId}</div>
            //                 </div>
            //               </div>
            //             </td>
            //             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            //               {formatDate(record.date)}
            //             </td>
            //             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            //               {record.checkIn ? formatTime(record.checkIn) : '--:--'}
            //             </td>
            //             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            //               {record.checkOut ? formatTime(record.checkOut) : '--:--'}
            //             </td>
            //             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            //               <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.totalHours >= 8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            //                 {record.totalHours} hours
            //               </span>
            //             </td>
            //           </tr>
            //         ))
            //       ) : (
            //         <tr>
            //           <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
            //             No attendance records found
            //           </td>
            //         </tr>
            //       )}
            //     </tbody>
            //   </table>
            // </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <tr key={`${record.employeeId}-${record.date}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`http://localhost:3000${record.profilePicture}` || 'https://via.placeholder.com/40'}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{record.fullName}</div>
                              <div className="text-sm text-gray-500">ID: {record.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.checkIn ? formatTime(record.checkIn) : '--:--'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.checkOut ? formatTime(record.checkOut) : '--:--'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.totalHours >= 8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {record.totalHours} hours
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => downloadAttendance(record)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Download
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminAttendance