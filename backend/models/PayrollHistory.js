import mongoose from 'mongoose';

const payrollHistorySchema = new mongoose.Schema({
  payrollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payroll',
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  // Hourly-based fields
  hourlyRate: {
    type: Number,
    required: true
  },
  overtimeRate: {
    type: Number,
    required: true
  },
  regularHours: {
    type: Number,
    required: true,
    default: 0
  },
  overtimeHours: {
    type: Number,
    required: true,
    default: 0
  },
  regularPay: {
    type: Number,
    required: true
  },
  overtimePay: {
    type: Number,
    required: true
  },
  // Other compensation fields
  allowances: {
    type: Number,
    default: 0
  },
  bonuses: {
    type: Number,
    default: 0
  },
  // Deduction fields
  deductions: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  // Summary fields
  grossPay: {
    type: Number,
    required: true
  },
  netPay: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'cancelled'],
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  payslipUrl: {
    type: String,
    default: ''
  },
  // Reference to the original payroll notes if needed
  notes: {
    type: String,
    default: ''
  },
  // Cancellation details (if applicable)
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  // Optimize for common queries
  indexes: [
    { employeeId: 1, status: 1 }, // For employee payroll history
    { month: 1, year: 1, status: 1 }, // For period-based reporting
    { paymentDate: 1 } // For financial reporting
  ]
});

// Middleware to ensure only paid/cancelled payrolls are archived
payrollHistorySchema.pre('save', function (next) {
  if (!['paid', 'cancelled'].includes(this.status)) {
    throw new Error('PayrollHistory can only be created for paid or cancelled payrolls');
  }
  next();
});

const PayrollHistory = mongoose.model('PayrollHistory', payrollHistorySchema);

export default PayrollHistory;