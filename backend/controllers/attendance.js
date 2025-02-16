import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";


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

// export const checkOut = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const employee = await Employee.findOne({ userId });

//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Normalize today's date to match the format in the database
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Find today's attendance record
//     const attendance = await Attendance.findOne({
//       employeeId: employee._id,
//       date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }, // Match today's date range
//     });

//     if (!attendance) {
//       return res.status(400).json({ message: "You must check in first" });
//     }

//     if (attendance.checkOut) {
//       return res.status(400).json({ message: "Already checked out today" });
//     }

//     // Calculate total working hours
//     const checkOutTime = new Date();
//     const hoursWorked = (checkOutTime - attendance.checkIn) / (1000 * 60 * 60); // Convert to hours

//     attendance.checkOut = checkOutTime;
//     attendance.totalHours = parseFloat(hoursWorked.toFixed(2));

//     await attendance.save();
//     res.status(200).json({ message: "Check-out successful", attendance });
//   } catch (error) {
//     console.error("Check-out error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Get Attendance Records (Modified to support admin view)
export const getAttendanceRecords = async (req, res) => {
  try {
    const { userId, isAdmin } = req.query;

    let records;
    if (isAdmin === "true") {
      records = await Attendance.find().populate("employeeId", "fullName email").sort({ date: -1 });
    } else {
      const employee = await Employee.findOne({ userId });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      records = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 });
    }

    res.status(200).json({ attendanceRecords: records });
  } catch (error) {
    console.error("Fetch attendance error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
