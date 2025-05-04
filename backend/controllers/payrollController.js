import moment from 'moment';
import Employee from '../models/Employee.js';
import Payroll from '../models/Payroll.js';
import Attendance from '../models/Attendance.js';
import PayrollHistory from '../models/PayrollHistory.js';

export const calculateCurrentPayroll = async (req, res) => {
  try {
    const { emp_id } = req.query;
    console.log("Request query result from the calculatePayroll:", req.query); // Debugging line

    if (!emp_id) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }

    const employee = await Employee.findById(emp_id).populate('userId');
    console.log("Employee found:", employee); // Debugging line
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (!employee.hourlyRate) {
      return res.status(400).json({
        success: false,
        message: 'Hourly rate not set for this employee. Please contact admin.'
      });
    }

    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // Check if payroll already exists
    const existingPayroll = await Payroll.findOne({
      employeeId: emp_id,
      month,
      year
    }).populate('employeeId');

    if (existingPayroll) {
      return res.status(200).json({
        success: true,
        payroll: existingPayroll
      });
    }

    // Calculate hours worked from attendance
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const attendanceRecords = await Attendance.find({
      employeeId: emp_id,
      date: { $gte: startDate, $lte: endDate },
      checkOut: { $ne: null }
    });

    let totalRegularHours = 0;
    let totalOvertimeHours = 0;

    attendanceRecords.forEach(record => {
      const hoursWorked = record.totalHours;

      if (hoursWorked <= 8) {
        totalRegularHours += hoursWorked;
      } else {
        totalRegularHours += 8;
        totalOvertimeHours += (hoursWorked - 8);
      }
    });

    // Calculate payroll
    const regularPay = totalRegularHours * employee.hourlyRate;
    const overtimePay = totalOvertimeHours * employee.overtimeHourlyRate;
    const grossPay = regularPay + overtimePay + (employee.allowances || 0);
    const tax = grossPay * (employee.taxInfo?.taxRate || 0.15);
    const netPay = grossPay - tax - (employee.deductions || 0);

    // Create payroll record
    const payroll = new Payroll({
      employeeId: emp_id,
      month,
      year,
      regularHours: totalRegularHours,
      overtimeHours: totalOvertimeHours,
      regularPay,
      overtimePay,
      allowances: employee.allowances || 0,
      bonuses: 0,
      deductions: employee.deductions || 0,
      tax,
      netPay,
      status: 'pending'
    });

    await payroll.save();
    await payroll.populate('employeeId'); // Ensure populated before returning

    console.log("Payroll calculated successfully:", payroll); // Debugging line

    res.status(200).json({
      success: true,
      payroll
    });

  } catch (error) {
    console.error('Error calculating payroll:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate payroll'
    });
  }
};

// Get payroll for specific month/year
export const getPayrollByPeriod = async (req, res) => {
  try {
    const { month, year } = req.params;
    const { emp_id } = req.query;

    if (!emp_id) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }

    const payroll = await Payroll.findOne({
      employeeId: emp_id,
      month: parseInt(month),
      year: parseInt(year)
    }).populate('employeeId');

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'No payroll record found for this period'
      });
    }

    res.status(200).json({ success: true, payroll });

  } catch (error) {
    console.error('Error fetching payroll:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payroll'
    });
  }
};

export const getPayrollHistory = async (req, res) => {
  try {
    const { emp_id, year } = req.query;
    console.log("req.user from getPayrollHistory: ", req.user)
    const role = req.user?.role

    if (role === "admin") {
      const pendingPayrolls = await Payroll.find({ status: 'pending' })
        .populate({
          path: 'employeeId',
          populate: {
            path: 'userId',
            select: 'fullName profileImage'
          }
        });
      console.log("Pending payrolls for admin is: ", pendingPayrolls)
      return res.status(200).json({ success: true, pendingPayrolls });
    }

    if (!emp_id) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }

    const query = { employeeId: emp_id };
    if (year) query.year = parseInt(year);

    const history = await Payroll.find(query)
      .sort({ year: -1, month: -1 })
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'fullName profileImage'
        }
      });

    // Transform the data to include fullName at the top level
    const transformedHistory = history.map(payroll => ({
      ...payroll.toObject(),
      fullName: payroll.employeeId?.userId?.fullName || 'Unknown'
    }));

    res.status(200).json({ success: true, history: transformedHistory });

  } catch (error) {
    console.error('Error fetching payroll history:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payroll history'
    });
  }
};

// Admin function to approve payroll
export const approvePayroll = async (req, res) => {
  try {
    const { payrollId } = req.params;

    const payroll = await Payroll.findByIdAndUpdate(
      payrollId,
      { status: 'approved', paymentDate: new Date() },
      { new: true }
    ).populate('employeeId');  // ADDED populate to get employee details

    console.log("Payroll is: ", payroll)

    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }

    // ADDED: Create payroll history record when approved
    if (payroll.status === 'approved') {
      const payrollHistory = new PayrollHistory({
        payrollId: payroll._id,
        employeeId: payroll.employeeId._id,
        userId: payroll.employeeId.userId,
        month: payroll.month,
        year: payroll.year,
        hourlyRate: payroll.employeeId.hourlyRate,
        overtimeRate: payroll.employeeId.overtimeHourlyRate,
        regularHours: payroll.regularHours,
        overtimeHours: payroll.overtimeHours,
        regularPay: payroll.regularPay,
        overtimePay: payroll.overtimePay,
        allowances: payroll.allowances,
        bonuses: payroll.bonuses,
        deductions: payroll.deductions,
        tax: payroll.tax,
        grossPay: payroll.regularPay + payroll.overtimePay + payroll.allowances,
        netPay: payroll.netPay,
        status: 'paid',  // Changed from approved to paid for history
        paymentDate: payroll.paymentDate,
        notes: payroll.notes
      });
      await payrollHistory.save();
    }

    res.status(200).json({
      success: true,
      payroll,
      message: 'Payroll approved successfully'
    });

  } catch (error) {
    console.error('Error approving payroll:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve payroll'
    });
  }
};

// Admin function to reject payroll
export const rejectPayroll = async (req, res) => {
  try {
    const { payrollId } = req.params;
    const { notes } = req.body;

    const payroll = await Payroll.findByIdAndUpdate(
      payrollId,
      { status: 'rejected', notes },
      { new: true }
    ).populate('employeeId');  // ADDED populate to get employee details

    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }

    // ADDED: Create payroll history record when rejected (cancelled)
    if (payroll.status === 'rejected') {
      const payrollHistory = new PayrollHistory({
        payrollId: payroll._id,
        employeeId: payroll.employeeId._id,
        userId: payroll.employeeId.userId,
        month: payroll.month,
        year: payroll.year,
        hourlyRate: payroll.employeeId.hourlyRate,
        overtimeRate: payroll.employeeId.overtimeHourlyRate,
        regularHours: payroll.regularHours,
        overtimeHours: payroll.overtimeHours,
        regularPay: payroll.regularPay,
        overtimePay: payroll.overtimePay,
        allowances: payroll.allowances,
        bonuses: payroll.bonuses,
        deductions: payroll.deductions,
        tax: payroll.tax,
        grossPay: payroll.regularPay + payroll.overtimePay + payroll.allowances,
        netPay: payroll.netPay,
        status: 'cancelled',
        paymentDate: new Date(),
        notes: payroll.notes,
        cancellationReason: notes  // ADDED cancellation reason from rejection notes
      });
      await payrollHistory.save();
    }

    res.status(200).json({
      success: true,
      payroll,
      message: 'Payroll rejected successfully'
    });

  } catch (error) {
    console.error('Error rejecting payroll:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject payroll'
    });
  }
};

// Admin function to recalculate payroll
export const recalculatePayroll = async (req, res) => {
  try {
    const { payrollId } = req.params;

    const payroll = await Payroll.findById(payrollId).populate('employeeId');
    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }

    const employee = payroll.employeeId;
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (!employee.hourlyRate) {
      return res.status(400).json({
        success: false,
        message: 'Hourly rate not set for this employee'
      });
    }

    // Recalculate hours worked from attendance
    const startDate = new Date(payroll.year, payroll.month - 1, 1);
    const endDate = new Date(payroll.year, payroll.month, 0, 23, 59, 59);

    const attendanceRecords = await Attendance.find({
      employeeId: employee._id,
      date: { $gte: startDate, $lte: endDate },
      checkOut: { $ne: null }
    });

    let totalRegularHours = 0;
    let totalOvertimeHours = 0;

    attendanceRecords.forEach(record => {
      const hoursWorked = record.totalHours;

      if (hoursWorked <= 8) {
        totalRegularHours += hoursWorked;
      } else {
        totalRegularHours += 8;
        totalOvertimeHours += (hoursWorked - 8);
      }
    });

    // Recalculate payroll
    const regularPay = totalRegularHours * employee.hourlyRate;
    const overtimePay = totalOvertimeHours * employee.overtimeHourlyRate;
    const grossPay = regularPay + overtimePay + (employee.allowances || 0);
    const tax = grossPay * (employee.taxInfo?.taxRate || 0.15);
    const netPay = grossPay - tax - (employee.deductions || 0);

    // Update payroll record
    payroll.regularHours = totalRegularHours;
    payroll.overtimeHours = totalOvertimeHours;
    payroll.regularPay = regularPay;
    payroll.overtimePay = overtimePay;
    payroll.allowances = employee.allowances || 0;
    payroll.deductions = employee.deductions || 0;
    payroll.tax = tax;
    payroll.netPay = netPay;
    payroll.status = 'pending'; // Reset to pending after recalculation

    await payroll.save();

    res.status(200).json({
      success: true,
      payroll,
      message: 'Payroll recalculated successfully'
    });

  } catch (error) {
    console.error('Error recalculating payroll:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to recalculate payroll'
    });
  }
};

// export const getPayrollHistoryByStatus = async (req, res) => {
//   try {
//     console.log("Inside the getPayrollHistoryByStatus function");
//     // Get all payroll histories with status paid or cancelled and populate user data
//     const payrollHistories = await PayrollHistory.aggregate([
//       {
//         $match: { 
//           status: { $in: ['paid', 'cancelled'] } 
//         }
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'userId',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },
//       { $unwind: '$user' },
//       {
//         $project: {
//           // Payroll fields
//           payrollId: 1,
//           month: 1,
//           year: 1,
//           hourlyRate: 1,
//           overtimeRate: 1,
//           regularHours: 1,
//           overtimeHours: 1,
//           regularPay: 1,
//           overtimePay: 1,
//           grossPay: 1,
//           netPay: 1,
//           status: 1,
//           paymentDate: 1,
//           notes: 1,
//           cancellationReason: 1,
//           createdAt: 1,
//           updatedAt: 1,

//           // User fields
//           'user._id': 1,
//           'user.fullName': 1,
//           'user.email': 1,
//           'user.profileImage': 1,
//           'user.dateOfBirth': 1,
//           'user.address': 1,
//           'user.cnic': 1
//         }
//       },
//       { $sort: { paymentDate: -1 } }
//     ]);

//     console.log("Payroll histories with user data fetched:", payrollHistories.length, "records");

//     // Group by status first, then by month/year (maintaining your original grouping logic)
//     const groupedByStatus = payrollHistories.reduce((acc, payroll) => {
//       const status = payroll.status;

//       // Initialize status group if it doesn't exist
//       if (!acc[status]) {
//         acc[status] = {};
//       }

//       // Group by month/year within each status
//       const key = `${payroll.month}-${payroll.year}`;
//       if (!acc[status][key]) {
//         acc[status][key] = {
//           month: payroll.month,
//           year: payroll.year,
//           count: 0,
//           totalAmount: 0,
//           payrolls: [],
//           processedOn: payroll.paymentDate,
//           status: status
//         };
//       }

//       acc[status][key].count += 1;
//       acc[status][key].totalAmount += payroll.netPay;
//       acc[status][key].payrolls.push(payroll);

//       // Update processedOn to the latest date
//       if (new Date(payroll.paymentDate) > new Date(acc[status][key].processedOn)) {
//         acc[status][key].processedOn = payroll.paymentDate;
//       }

//       return acc;
//     }, {});

//     // Convert to array format for frontend
//     const result = {};
//     for (const status in groupedByStatus) {
//       result[status] = Object.values(groupedByStatus[status]);
//     }

//     res.status(200).json({
//       success: true,
//       count: payrollHistories.length,
//       groupedPayrolls: result,  // Changed from 'data' to 'groupedPayrolls' to match frontend
//       rawData: payrollHistories // Optional: include raw data if needed
//     });

//   } catch (error) {
//     console.error('Error fetching payroll history with user data:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Failed to fetch payroll history with user data'
//     });
//   }
// };

