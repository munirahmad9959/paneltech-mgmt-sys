import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ApiClient } from "../../utils";

const EmpAttendance = ({ setShowSidebar, setNavDropDown }) => {
  const [arrivalTime, setArrivalTime] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const hourlyRate = 10; // Example hourly rate in dollars
  const user = useSelector((state) => state.auth.user);

  // useEffect(() => {
  //   const fetchAttendance = async () => {
  //     try {
  //       const response = await axios.get(`/attendance/${user._id}`);
  //       const latestAttendance = response.data.attendanceRecords[0];

  //       if (latestAttendance) {
  //         setArrivalTime(new Date(latestAttendance.checkIn));
  //         if (latestAttendance.checkOut) {
  //           setDepartureTime(new Date(latestAttendance.checkOut));
  //           setTotalHours(latestAttendance.totalHours);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching attendance:", error);
  //     }
  //   };

  //   fetchAttendance();
  // }, [user._id]);

  const markArrival = async () => {
    try {
      const response = await ApiClient.post("/attendance/checkin", { userId: user._id });
      console.log("Check-in response:", response.data);
      setArrivalTime(new Date(response.data.attendance.checkIn));
    } catch (error) {
      alert(error.response?.data?.message || "Error marking arrival");
    }
  };

  const markDeparture = async () => {
    // if (!arrivalTime) {
    //   alert("Please mark your arrival first!");
    //   return;
    // }
    try {
      const response = await ApiClient.post("/attendance/checkout", { userId: user._id });
      setDepartureTime(new Date(response.data.attendance.checkOut));
      setTotalHours(response.data.attendance.totalHours);
    } catch (error) {
      alert(error.response?.data?.message || "Error marking departure");
    }
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
      </div>
    </div>
  );
};

export default EmpAttendance;
