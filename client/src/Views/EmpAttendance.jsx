// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { createApiClient } from "../../Utils/Utils";


// const EmpAttendance = ({ setShowSidebar, setNavDropDown }) => {
//   const [attendanceRecords, setAttendanceRecords] = useState([]); // New state to store attendance data
//   const [arrivalTime, setArrivalTime] = useState(null);
//   const [departureTime, setDepartureTime] = useState(null);
//   const [totalHours, setTotalHours] = useState(0);
//   const hourlyRate = 10; // Example hourly rate in dollars
//   const user = useSelector((state) => state.auth.user);
//   const token = useSelector((state) => state.auth.token); // ✨ NEW CODE: Get token from state
//   const dispatch = useDispatch();
//   const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);
//   const fetchAttendance = async () => {
//     try {
//       const response = await ApiClient.get(`/attendance/${user.user?._id}`, {
//         headers: { Authorization: `Bearer ${token}` }, 
//       });

//       setAttendanceRecords(response.data.attendanceRecords);
//       console.log("Attendance records:", response.data);
//     } catch (error) {
//       console.error("Error fetching attendance:", error);
//     }

//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, [user.user?._id]);

//   const markArrival = async () => {
//     try {
//       const response = await ApiClient.post(
//         "/attendance/checkin",
//         { userId: user.user?._id },
//         { headers: { Authorization: `Bearer ${token}` } } 
//       );
//       console.log("Check-in response:", response.data);
//       setArrivalTime(new Date(response.data.attendance.checkIn));
//       fetchAttendance();
//     } catch (error) {
//       alert(error.response?.data?.message || "Error marking arrival");
//     }
//   };

//   const markDeparture = async () => {
//     try {
//       const response = await ApiClient.post(
//         "/attendance/checkout",
//         { userId: user.user?._id },
//         { headers: { Authorization: `Bearer ${token}` } } 
//       );
//       setDepartureTime(new Date(response.data.attendance.checkOut));
//       setTotalHours(response.data.attendance.totalHours);
//       fetchAttendance();
//       setArrivalTime(null);
//       setDepartureTime(null);
//     } catch (error) {
//       alert(error.response?.data?.message || "Error marking departure");
//     }
//   };

//   const handleDownloadAttendanceClick = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text("Employee Attendance Report", 14, 20);
//     doc.setFontSize(12);
//     doc.text(`Employee Name: ${user.user?.fullName}`, 14, 30);
//     doc.text(`Employee ID: ${user.user?._id}`, 14, 38);
//     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 46);

//     const tableColumn = ["Date", "Check-in", "Check-out", "Total Hours"];
//     const tableRows = [];

//     attendanceRecords.forEach((record) => {
//       const recordData = [
//         new Date(record.date).toLocaleDateString(),
//         new Date(record.checkIn).toLocaleTimeString(),
//         record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "N/A",
//         record.totalHours.toFixed(2) + " hrs",
//       ];
//       tableRows.push(recordData);
//     });

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 50,
//     });

//     doc.save("Attendance_Report.pdf"); 
//   };

//   return (
//     <div
//       className="p-6 bg-white min-h-screen"
//       onClick={() => {
//         setShowSidebar(false);
//         setNavDropDown(false);
//       }}
//     >
//       <h1 className="text-3xl font-bold mb-6 text-[#2b2a2a]">Employee Attendance</h1>

//       <div className="flex flex-col items-center space-y-4">
//         <button
//           onClick={markArrival}
//           className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
//         >
//           Mark Arrival
//         </button>

//         {arrivalTime && (
//           <p className="text-lg font-medium text-gray-700">
//             Arrival Time: {arrivalTime.toLocaleTimeString()}
//           </p>
//         )}

//         <button
//           onClick={markDeparture}
//           className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
//         >
//           Mark Departure
//         </button>

//         {departureTime && (
//           <p className="text-lg font-medium text-gray-700">
//             Departure Time: {departureTime.toLocaleTimeString()}
//           </p>
//         )}

//         {totalHours > 0 && (
//           <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
//             <p className="text-lg font-semibold text-gray-900">
//               Total Hours Worked: {totalHours} hrs
//             </p>
//             <p className="text-lg font-semibold text-green-600">
//               Estimated Payroll: ${(totalHours * hourlyRate).toFixed(2)}
//             </p>
//           </div>
//         )}

//         <button
//           onClick={handleDownloadAttendanceClick}
//           className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
//         >
//           Download Attendance Report
//         </button>
//       </div>

//       {/* New Table for Displaying Attendance Records */}
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Attendance History</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-200 shadow-lg">
//             <thead className="bg-gray-100">
//               <tr className="text-gray-600 uppercase text-sm leading-normal">
//                 <th className="py-3 px-6 text-left border border-gray-200">Date</th>
//                 <th className="py-3 px-6 text-left border border-gray-200">Check-in</th>
//                 <th className="py-3 px-6 text-left border border-gray-200">Check-out</th>
//                 <th className="py-3 px-6 text-left border border-gray-200">Total Hours</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700 text-sm">
//               {attendanceRecords.length > 0 ? (
//                 attendanceRecords.map((record) => (
//                   <tr key={record._id} className="border-b border-gray-200 hover:bg-gray-50">
//                     <td className="py-3 px-6 border border-gray-200">
//                       {new Date(record.date).toLocaleDateString()}
//                     </td>
//                     <td className="py-3 px-6 border border-gray-200">
//                       {new Date(record.checkIn).toLocaleTimeString()}
//                     </td>
//                     <td className="py-3 px-6 border border-gray-200">
//                       {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "N/A"}
//                     </td>
//                     <td className="py-3 px-6 border border-gray-200">
//                       {record.totalHours.toFixed(2)} hrs
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="text-center py-4 text-gray-500">
//                     No attendance records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {/* End of Table */}
//     </div>
//   );
// };

// export default EmpAttendance;


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { createApiClient } from "../../Utils/Utils";
import { format } from 'date-fns';

const EmpAttendance = ({ setShowSidebar, setNavDropDown }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const hourlyRate = 10;
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);

  const fetchAttendance = async () => {
    try {
      const response = await ApiClient.get(`/attendance/${user.user?._id}`, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      setAttendanceRecords(response.data.attendanceRecords);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user.user?._id]);

  const markArrival = async () => {
    try {
      const response = await ApiClient.post(
        "/attendance/checkin",
        { userId: user.user?._id },
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      setArrivalTime(new Date(response.data.attendance.checkIn));
      fetchAttendance();
    } catch (error) {
      alert(error.response?.data?.message || "Error marking arrival");
    }
  };

  const markDeparture = async () => {
    try {
      const response = await ApiClient.post(
        "/attendance/checkout",
        { userId: user.user?._id },
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      setDepartureTime(new Date(response.data.attendance.checkOut));
      setTotalHours(response.data.attendance.totalHours);
      fetchAttendance();
      setArrivalTime(null);
      setDepartureTime(null);
    } catch (error) {
      alert(error.response?.data?.message || "Error marking departure");
    }
  };

  const handleDownloadAttendanceClick = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee Attendance Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Employee Name: ${user.user?.fullName}`, 14, 30);
    doc.text(`Employee ID: ${user.user?._id}`, 14, 38);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 46);

    const tableColumn = ["Date", "Check-in", "Check-out", "Total Hours"];
    const tableRows = [];

    attendanceRecords.forEach((record) => {
      const recordData = [
        new Date(record.date).toLocaleDateString(),
        new Date(record.checkIn).toLocaleTimeString(),
        record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "N/A",
        record.totalHours.toFixed(2) + " hrs",
      ];
      tableRows.push(recordData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
    });

    doc.save("Attendance_Report.pdf"); 
  };

  return (
    <div
      className="p-8 bg-gray-50 min-h-screen"
      onClick={() => {
        setShowSidebar(false);
        setNavDropDown(false);
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Employee Attendance</h1>
          <button
            onClick={handleDownloadAttendanceClick}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export Report
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Time Tracking</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="text-center">
              <button
                onClick={markArrival}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-2 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Check In
              </button>
              {arrivalTime && (
                <p className="mt-3 text-gray-600 font-medium">
                  Checked in at: <span className="text-green-600">{format(arrivalTime, 'hh:mm a')}</span>
                </p>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={markDeparture}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 flex items-center gap-2 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Check Out
              </button>
              {departureTime && (
                <p className="mt-3 text-gray-600 font-medium">
                  Checked out at: <span className="text-red-600">{format(departureTime, 'hh:mm a')}</span>
                </p>
              )}
            </div>
          </div>

          {totalHours > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 font-medium">Hours Worked</p>
                  <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(2)} hrs</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 font-medium">Estimated Pay</p>
                  <p className="text-2xl font-bold text-green-600">${(totalHours * hourlyRate).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">Attendance History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-out
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(record.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(record.checkIn), 'hh:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.checkOut ? format(new Date(record.checkOut), 'hh:mm a') : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.totalHours.toFixed(2)} hrs
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpAttendance;