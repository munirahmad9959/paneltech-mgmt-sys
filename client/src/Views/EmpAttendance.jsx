import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { createApiClient } from "../../Utils/Utils";


const EmpAttendance = ({ setShowSidebar, setNavDropDown }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]); // New state to store attendance data
  const [arrivalTime, setArrivalTime] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const hourlyRate = 10; // Example hourly rate in dollars
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token); // ✨ NEW CODE: Get token from state
  const dispatch = useDispatch();
  const ApiClient = React.useMemo(() => createApiClient(dispatch), [dispatch]);
  const fetchAttendance = async () => {
    try {
      const response = await ApiClient.get(`/attendance/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` }, 
      });

      setAttendanceRecords(response.data.attendanceRecords);
      console.log("Attendance records:", response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }

  };

  useEffect(() => {
    fetchAttendance();
  }, [user._id]);

  const markArrival = async () => {
    try {
      const response = await ApiClient.post(
        "/attendance/checkin",
        { userId: user.userId },
        { headers: { Authorization: `Bearer ${token}` } } // ✨ CHANGED CODE: Send token
      );
      console.log("Check-in response:", response.data);
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
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } } // ✨ CHANGED CODE: Send token
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
    doc.text(`Employee Name: ${user.fullName}`, 14, 30);
    doc.text(`Employee ID: ${user._id}`, 14, 38);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 46);

    // Table Headers
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

    // ✅ Use autoTable correctly
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
    });

    doc.save("Attendance_Report.pdf"); // Save the PDF
  };

  return (
    <div
      className="p-6 bg-white min-h-screen"
      onClick={() => {
        setShowSidebar(false);
        setNavDropDown(false);
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-[#2b2a2a]">Employee Attendance</h1>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={markArrival}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
        >
          Mark Arrival
        </button>

        {arrivalTime && (
          <p className="text-lg font-medium text-gray-700">
            Arrival Time: {arrivalTime.toLocaleTimeString()}
          </p>
        )}

        <button
          onClick={markDeparture}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
        >
          Mark Departure
        </button>

        {departureTime && (
          <p className="text-lg font-medium text-gray-700">
            Departure Time: {departureTime.toLocaleTimeString()}
          </p>
        )}

        {totalHours > 0 && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-900">
              Total Hours Worked: {totalHours} hrs
            </p>
            <p className="text-lg font-semibold text-green-600">
              Estimated Payroll: ${(totalHours * hourlyRate).toFixed(2)}
            </p>
          </div>
        )}

        <button
          onClick={handleDownloadAttendanceClick}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
        >
          Download Attendance Report
        </button>
      </div>

      {/* New Table for Displaying Attendance Records */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Attendance History</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 shadow-lg">
            <thead className="bg-gray-100">
              <tr className="text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left border border-gray-200">Date</th>
                <th className="py-3 px-6 text-left border border-gray-200">Check-in</th>
                <th className="py-3 px-6 text-left border border-gray-200">Check-out</th>
                <th className="py-3 px-6 text-left border border-gray-200">Total Hours</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record) => (
                  <tr key={record._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 border border-gray-200">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 border border-gray-200">
                      {new Date(record.checkIn).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-6 border border-gray-200">
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "N/A"}
                    </td>
                    <td className="py-3 px-6 border border-gray-200">
                      {record.totalHours.toFixed(2)} hrs
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* End of Table */}
    </div>
  );
};

export default EmpAttendance;
