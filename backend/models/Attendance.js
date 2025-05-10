import mongoose from "mongoose";
import Payroll from "./Payroll.js"; 
import Employee from "./Employee.js"; 

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
      default: 0,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, collection: "attendance" }
);


attendanceSchema.post('save', async function (doc) {
  if (doc.checkOut && !doc.isModified('checkIn')) { 
    try {
      console.log(`[Payroll] Recalculating for employee ${doc.employeeId}...`);
      
      const employee = await Employee.findById(doc.employeeId);
      if (!employee || !employee.hourlyRate) return; 

      const currentDate = new Date(doc.date);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      const records = await mongoose.model('Attendance').find({
        employeeId: doc.employeeId,
        date: { $gte: startDate, $lte: endDate },
        checkOut: { $ne: null } 
      });

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

      const regularPay = totalRegularHours * employee.hourlyRate;
      const overtimePay = totalOvertimeHours * employee.overtimeHourlyRate; 
      const grossPay = regularPay + overtimePay + (employee.allowances || 0);
      const tax = grossPay * (employee.taxInfo?.taxRate || 0.15);
      const netPay = grossPay - tax - (employee.deductions || 0);

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