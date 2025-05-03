import Payroll from '../models/Payroll.js';
import PayrollHistory from '../models/PayrollHistory.js';
import Employee from '../models/Employee.js';
import mongoose from 'mongoose';

// Calculate payroll with 15% tax
const calculatePayroll = (basicSalary, allowances, bonuses, deductions) => {
  const taxableAmount = basicSalary + allowances + bonuses;
  const tax = taxableAmount * 0.15; // 15% tax
  const netPay = taxableAmount - tax - deductions;

  return {
    tax,
    netPay
  };
};

// Get current payroll for employee
export const getCurrentPayroll = async (req, res) => {
  try {
    console.log("User ID from request from getCurrentPayroll:", req.user); // Debugging line
    console.log("User ID from request from getCurrentPayroll:", req.user._id); // Debugging line
    const userId = req.user._id;
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    console.log(`Querying payroll for:`, {
      userId,
      month,
      year,
      currentDate: currentDate.toISOString()
    }); // Debugging line

    const payroll = await Payroll.findOne({
      userId,
      month,
      year
    }).populate('employeeId', 'department position status');

    console.log(`Payroll found:`, payroll); // Debugging line

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found for this month' });
    }

    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payroll history for employee
export const getPayrollHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year } = req.query;

    console.log("Request.query are:", req.query); // Debugging line

    const query = { userId };
    if (year) {
      query.year = parseInt(year);
    }

    const history = await PayrollHistory.find(query)
      .sort({ year: -1, month: -1 })
      .limit(12);
    console.log("History found:", history); // Debugging line

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate payroll for employee (Admin only)
export const generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year, allowances = 0, bonuses = 0, deductions = 0 } = req.body;

    // Check if payroll already exists
    const existingPayroll = await Payroll.findOne({ employeeId, month, year });
    if (existingPayroll) {
      return res.status(400).json({ message: 'Payroll already exists for this period' });
    }

    // Get employee details
    const employee = await Employee.findById(employeeId).populate('userId');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Calculate payroll
    const { tax, netPay } = calculatePayroll(
      employee.basicSalary,
      allowances,
      bonuses,
      deductions
    );

    // Create new payroll
    const payroll = new Payroll({
      employeeId,
      userId: employee.userId._id,
      month,
      year,
      basicSalary: employee.basicSalary,
      allowances,
      bonuses,
      deductions,
      tax,
      netPay,
      status: 'pending'
    });

    await payroll.save();

    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process payroll payment (Admin only)
export const processPayrollPayment = async (req, res) => {
  try {
    console.log("Processing payroll payment:", req.body); // Debugging line
    const { payrollId, paymentDate } = req.body;

    const payroll = await Payroll.findById(payrollId);
    console.log("Payroll found:", payroll); // Debugging line
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    if (payroll.status !== 'pending') {
      return res.status(400).json({ message: 'Payroll already processed' });
    }

    // Update payroll status
    payroll.status = 'paid';
    payroll.paymentDate = paymentDate || new Date();
    await payroll.save();

    // Create history record
    const payrollHistory = new PayrollHistory({
      payrollId: payroll._id,
      employeeId: payroll.employeeId,
      userId: payroll.userId,
      month: payroll.month,
      year: payroll.year,
      basicSalary: payroll.basicSalary,
      netPay: payroll.netPay,
      status: 'paid',
      paymentDate: payroll.paymentDate
    });

    await payrollHistory.save();

    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payroll by month/year for employee
export const getPayrollByPeriod = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.params;

    const payroll = await Payroll.findOne({
      userId,
      month: parseInt(month),
      year: parseInt(year)
    });

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found for this period' });
    }

    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};