import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import PDFDocument from 'pdfkit'; // ✨ NEW: Add PDF generation library
import fs from 'fs';

// Mark Check-In
export const checkIn = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is sent from frontend
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Normalize today's date to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if employee has already checked in today
    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: today }, // Ensure correct date comparison
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    // Mark check-in
    const attendance = new Attendance({
      employeeId: employee._id,
      checkIn: new Date(),
      date: today, // Store as a proper Date object
    });

    await attendance.save();
    res.status(200).json({ message: "Check-in successful", attendance });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// // Mark Check-Out
export const checkOut = async (req, res) => {
  try {
    const { userId } = req.body;
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Normalize today's date to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: today }, // Ensure correct date comparison
    });

    if (!attendance) {
      return res.status(400).json({ message: "You must check in first" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    // Calculate total working hours
    const checkOutTime = new Date();
    const hoursWorked = (checkOutTime - attendance.checkIn) / (1000 * 60 * 60); // Convert to hours

    attendance.checkOut = checkOutTime;
    attendance.totalHours = parseFloat(hoursWorked.toFixed(2));

    await attendance.save();
    res.status(200).json({ message: "Check-out successful", attendance });
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAttendanceRecords = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("User ID:", userId);

    let records;
    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    records = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 });

    res.status(200).json({ attendanceRecords: records });
  } catch (error) {
    console.error("Fetch attendance error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAllAttendanceRecords = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'fullName profileImage'
        }
      })
      .sort({ date: -1 })
      .select('employeeId checkIn checkOut date totalHours');

    // Transform the data to match the required format
    const formattedRecords = records.map(record => ({
      employeeId: record.employeeId._id,
      profilePicture: record.employeeId.userId.profileImage,
      fullName: record.employeeId.userId.fullName,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      date: record.date,
      totalHours: record.totalHours
    }));

    res.status(200).json({ attendanceRecords: formattedRecords });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New controller to get all records for a specific employee
// export const getEmployeeAttendanceRecords = async (req, res) => {
//   try {
//     const { employeeId } = req.params;

//     const records = await Attendance.find({ employeeId })
//       .sort({ date: -1 })
//       .select('checkIn checkOut date totalHours');

//     res.status(200).json({ attendanceRecords: records });
//   } catch (error) {
//     console.error("Fetch employee attendance error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const getEmployeeAttendanceRecords = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const records = await Attendance.find({ employeeId })
      .sort({ date: -1 })
      .select('checkIn checkOut date totalHours employeeId')
      .populate({
        path: 'employeeId',
        select: 'userId',
        populate: {
          path: 'userId',
          select: 'fullName'
        }
      });

    const formattedRecords = records.map(record => ({
      employeeName: record.employeeId?.userId?.fullName || 'N/A',
      employeeId: record.employeeId?._id,
      date: record.date,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      totalHours: record.totalHours
    }));

    res.status(200).json({ attendanceRecords: formattedRecords });
  } catch (error) {
    console.error("Fetch employee attendance error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
