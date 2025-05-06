// import mongoose from "mongoose";

// const attendanceSchema = new mongoose.Schema(
//   {
//     employeeId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Employee',
//       required: true,
//     },
//     checkIn: {
//       type: Date,
//       default: null,
//     },
//     checkOut: {
//       type: Date,
//       default: null,
//     },
//     totalHours: {
//       type: Number,
//       default: 0, // Calculated after check-out
//     },
//     date: {
//       type: Date,
//       required: true,
//     },
//   },
//   { timestamps: true, collection: "attendance" }
// );

// const Attendance = mongoose.model("Attendance", attendanceSchema);
// export default Attendance;

import mongoose from "mongoose";
import Payroll from "./Payroll.js"; // Ensure this path is correct
import Employee from "./Employee.js"; // Ensure this path is correct

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    totalHours: {
      type: Number,
      default: 0, // Calculated after check-out
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, collection: "attendance" }
);

// ================================================
// MIDDLEWARE: Auto-update payroll on checkOut
// ================================================
attendanceSchema.post('save', async function (doc) {
  if (doc.checkOut && !doc.isModified('checkIn')) { // Only trigger on checkOut
    try {
      console.log(`[Payroll] Recalculating for employee ${doc.employeeId}...`);
      
      // 1. Get employee and current month/year
      const employee = await Employee.findById(doc.employeeId);
      if (!employee || !employee.hourlyRate) return; // Skip if no rate set

      const currentDate = new Date(doc.date);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      // 2. Fetch all attendance records for the month
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      const records = await mongoose.model('Attendance').find({
        employeeId: doc.employeeId,
        date: { $gte: startDate, $lte: endDate },
        checkOut: { $ne: null } // Only completed shifts
      });

      // 3. Calculate total hours
      let totalRegularHours = 0;
      let totalOvertimeHours = 0;

      records.forEach(record => {
        if (record.totalHours <= 8) {
          totalRegularHours += record.totalHours;
        } else {
          totalRegularHours += 8;
          totalOvertimeHours += (record.totalHours - 8);
        }
      });

      // 4. Calculate payroll values
      const regularPay = totalRegularHours * employee.hourlyRate;
      const overtimePay = totalOvertimeHours * employee.overtimeHourlyRate; // overtimeHourlyRate is a virtual field in Employee model if this doesn't work then you can use the following line 
      // const overtimePay = totalOvertimeHours * (employee.hourlyRate * employee.overtimeRate);
      const grossPay = regularPay + overtimePay + (employee.allowances || 0);
      const tax = grossPay * (employee.taxInfo?.taxRate || 0.15);
      const netPay = grossPay - tax - (employee.deductions || 0);

      // 5. Update payroll record (create if doesn't exist)
      await Payroll.findOneAndUpdate(
        { employeeId: doc.employeeId, month, year },
        {
          employeeId: doc.employeeId,
          month,
          year,
          regularHours: totalRegularHours,
          overtimeHours: totalOvertimeHours,
          regularPay,
          overtimePay,
          allowances: employee.allowances || 0,
          deductions: employee.deductions || 0,
          tax,
          netPay,
          status: 'pending'
        },
        { upsert: true, new: true }
      );

      console.log(`[Payroll] Updated for ${employee.userId.fullName} (${month}/${year})`);
    } catch (error) {
      console.error('[Payroll] Error in post-save hook:', error);
    }
  }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;