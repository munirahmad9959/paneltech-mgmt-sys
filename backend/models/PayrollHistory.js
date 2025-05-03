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
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  basicSalary: {
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
  }
}, {
  timestamps: true
});

const PayrollHistory = mongoose.model('PayrollHistory', payrollHistorySchema);

export default PayrollHistory;