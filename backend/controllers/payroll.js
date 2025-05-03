import Payroll from '../models/Payroll.js';
import Employee from '../models/Employee.js';
import asyncHandler from 'express-async-handler';

// @desc    Get current payroll for employee
// @route   GET /api/payroll/current/:employeeId
// @access  Private
const getCurrentPayroll = asyncHandler(async (req, res) => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    const payroll = await Payroll.findOne({
        employee: req.params.employeeId,
        month,
        year
    }).populate('employee', 'firstName lastName employeeId department position');
    
    if (!payroll) {
        return res.status(404).json({ message: 'Payroll not found for this month' });
    }
    
    res.json(payroll);
});

// @desc    Get payroll history for employee
// @route   GET /api/payroll/history/:employeeId
// @access  Private
const getPayrollHistory = asyncHandler(async (req, res) => {
    const payrolls = await Payroll.find({
        employee: req.params.employeeId
    })
    .sort({ year: -1, month: -1 })
    .populate('employee', 'firstName lastName employeeId');
    
    res.json(payrolls);
});

// @desc    Get payroll by month and year
// @route   GET /api/payroll/:employeeId/:year/:month
// @access  Private
const getPayrollByMonth = asyncHandler(async (req, res) => {
    const payroll = await Payroll.findOne({
        employee: req.params.employeeId,
        year: parseInt(req.params.year),
        month: parseInt(req.params.month)
    }).populate('employee', 'firstName lastName employeeId department position');
    
    if (!payroll) {
        return res.status(404).json({ message: 'Payroll not found for this period' });
    }
    
    res.json(payroll);
});

// @desc    Create new payroll record
// @route   POST /api/payroll
// @access  Private/Admin
const createPayroll = asyncHandler(async (req, res) => {
    const { employee, month, year, basicSalary, allowances, bonuses, deductions, tax } = req.body;
    
    // Calculate net pay
    const netPay = basicSalary + allowances + bonuses - deductions - tax;
    
    // Check if payroll already exists for this period
    const existingPayroll = await Payroll.findOne({ employee, month, year });
    
    if (existingPayroll) {
        return res.status(400).json({ message: 'Payroll already exists for this period' });
    }
    
    // Verify employee exists
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    
    const payroll = await Payroll.create({
        employee,
        month,
        year,
        basicSalary,
        allowances,
        bonuses,
        deductions,
        tax,
        netPay,
        status: req.body.status || 'Pending',
        paymentDate: req.body.paymentDate || null,
        paymentMethod: req.body.paymentMethod || 'Bank Transfer',
        notes: req.body.notes || ''
    });
    
    res.status(201).json(payroll);
});

// @desc    Update payroll record
// @route   PUT /api/payroll/:id
// @access  Private/Admin
const updatePayroll = asyncHandler(async (req, res) => {
    const payroll = await Payroll.findById(req.params.id);
    
    if (!payroll) {
        return res.status(404).json({ message: 'Payroll not found' });
    }
    
    // Recalculate net pay if any financial fields are updated
    const basicSalary = req.body.basicSalary || payroll.basicSalary;
    const allowances = req.body.allowances || payroll.allowances;
    const bonuses = req.body.bonuses || payroll.bonuses;
    const deductions = req.body.deductions || payroll.deductions;
    const tax = req.body.tax || payroll.tax;
    
    const netPay = basicSalary + allowances + bonuses - deductions - tax;
    
    const updatedPayroll = await Payroll.findByIdAndUpdate(
        req.params.id,
        {
            ...req.body,
            netPay
        },
        { new: true }
    );
    
    res.json(updatedPayroll);
});

// @desc    Delete payroll record
// @route   DELETE /api/payroll/:id
// @access  Private/Admin
const deletePayroll = asyncHandler(async (req, res) => {
    const payroll = await Payroll.findById(req.params.id);
    
    if (!payroll) {
        return res.status(404).json({ message: 'Payroll not found' });
    }
    
    await payroll.remove();
    
    res.json({ message: 'Payroll removed' });
});

// @desc    Generate payroll for all employees for a given month/year
// @route   POST /api/payroll/generate
// @access  Private/Admin
const generatePayrolls = asyncHandler(async (req, res) => {
    const { month, year } = req.body;
    
    // Get all active employees
    const employees = await Employee.find({ status: 'active' });
    
    if (employees.length === 0) {
        return res.status(400).json({ message: 'No active employees found' });
    }
    
    // Check if payroll already exists for this period
    const existingPayrolls = await Payroll.find({ month, year });
    if (existingPayrolls.length > 0) {
        return res.status(400).json({ message: 'Payroll already generated for this period' });
    }
    
    // Create payroll for each employee
    const payrolls = await Promise.all(
        employees.map(async (employee) => {
            // Calculate payroll components (this can be customized based on your business logic)
            const basicSalary = employee.basicSalary;
            const allowances = basicSalary * 0.2; // Example: 20% of basic salary
            const bonuses = 0; // Can be calculated based on performance
            const deductions = 0; // Can include loans, advances, etc.
            const tax = basicSalary * 0.1; // Example: 10% tax
            const netPay = basicSalary + allowances + bonuses - deductions - tax;
            
            return Payroll.create({
                employee: employee._id,
                month,
                year,
                basicSalary,
                allowances,
                bonuses,
                deductions,
                tax,
                netPay,
                status: 'Pending'
            });
        })
    );
    
    res.status(201).json(payrolls);
});

export {
    getCurrentPayroll,
    getPayrollHistory,
    getPayrollByMonth,
    createPayroll,
    updatePayroll,
    deletePayroll,
    generatePayrolls
};