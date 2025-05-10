import moment from 'moment';
import Employee from '../models/Employee.js';
import Payroll from '../models/Payroll.js';
import Attendance from '../models/Attendance.js';
import PayrollHistory from '../models/PayrollHistory.js';
import ExcelJS from 'exceljs';


export const calculateCurrentPayroll = async (req, res) => {
  try {
    const { emp_id } = req.query;

    if (!emp_id) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }

    const employee = await Employee.findById(emp_id).populate('userId');
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

    // Calculate hours worked from attendance (UTC timezone-safe)
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const attendanceRecords = await Attendance.find({
      employeeId: emp_id,
      date: { $gte: startDate, $lte: endDate },
      checkOut: { $ne: null } // Only count completed shifts
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

    // Upsert payroll record (update if exists, otherwise create)
    const payroll = await Payroll.findOneAndUpdate(
      { employeeId: emp_id, month, year },
      {
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
      },
      { upsert: true, new: true }
    ).populate('employeeId');

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


export const getPayrollHistoryByStatus = async (req, res) => {
  try {
    console.log("Inside the getPayrollHistoryByStatus function");
    
    // Get all payroll histories with status paid or cancelled
    const payrollHistories = await PayrollHistory.aggregate([
      {
        $match: { 
          status: { $in: ['paid', 'cancelled'] } 
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          month: 1,
          year: 1,
          netPay: 1,
          status: 1,
          paymentDate: 1,
          'user._id': 1
        }
      },
      { $sort: { year: -1, month: -1 } }
    ]);

    console.log("Payroll histories fetched:", payrollHistories);

    // Group by month/year period
    const groupedByPeriod = payrollHistories.reduce((acc, payroll) => {
      const monthNames = ["January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"];
      const periodKey = `${payroll.year}-${payroll.month}`;
      const periodName = `${monthNames[payroll.month - 1]} ${payroll.year}`;
      
      if (!acc[periodKey]) {
        acc[periodKey] = {
          month: payroll.month,
          year: payroll.year,
          period: periodName,
          employeesPaid: new Set(),
          totalAmount: 0,
          processedOn: payroll.paymentDate,
          status: 'Completed'
        };
      }

      acc[periodKey].employeesPaid.add(payroll.user._id.toString());
      acc[periodKey].totalAmount += payroll.netPay;
      
      if (new Date(payroll.paymentDate) > new Date(acc[periodKey].processedOn)) {
        acc[periodKey].processedOn = payroll.paymentDate;
      }

      return acc;
    }, {});

    // Convert to array format and transform for frontend
    const result = Object.values(groupedByPeriod).map(period => ({
      month: period.month,
      year: period.year,
      period: period.period,
      employeesPaid: period.employeesPaid.size,
      totalAmount: period.totalAmount,
      processedOn: period.processedOn,
      status: period.status
    }));

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching payroll history:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payroll history'
    });
  }
};

export const exportPayrollHistory = async (req, res) => {
  try {
    console.log("Export payrollHistory called")
    const { month, year } = req.query;

    // Build match criteria
    let matchCriteria = {};
    if (month && year) {
      matchCriteria.month = parseInt(month);
      matchCriteria.year = parseInt(year);
    }

    // Fetch payroll data with employee and user details
    const payrolls = await Payroll.aggregate([
      { $match: matchCriteria },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      {
        $lookup: {
          from: 'users',
          localField: 'employee.userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          month: 1,
          year: 1,
          netPay: 1,
          status: 1,
          paymentDate: 1,
          'user.fullName': 1,
          'employee.position': 1,
          regularHours: 1,
          regularPay: 1,
          overtimeHours: 1,
          overtimePay: 1,
          allowances: 1,
          tax: 1,
          deductions: 1,
          notes: 1
        }
      },
      { $sort: { year: -1, month: -1 } }
    ]);

    res.status(200).json({
      success: true,
      payrolls
    });
  } catch (error) {
    console.error('Error fetching payroll history:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payroll history'
    });
  }
};