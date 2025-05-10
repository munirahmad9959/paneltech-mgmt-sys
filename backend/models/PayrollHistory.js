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
  allowances: {
    type: Number,
    default: 0
  },
  bonuses: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
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
  notes: {
    type: String,
    default: ''
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  indexes: [
    { employeeId: 1, status: 1 }, 
    { month: 1, year: 1, status: 1 },
    { paymentDate: 1 } 
  ]
});

payrollHistorySchema.pre('save', function (next) {
  if (!['paid', 'cancelled'].includes(this.status)) {
    throw new Error('PayrollHistory can only be created for paid or cancelled payrolls');
  }
  next();
});

const PayrollHistory = mongoose.model('PayrollHistory', payrollHistorySchema);

export default PayrollHistory;