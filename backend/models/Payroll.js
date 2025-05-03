// import mongoose from 'mongoose';

// const PayrollSchema = new mongoose.Schema({
//     employee: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Employee',
//         required: true
//     },
//     month: {
//         type: Number,
//         required: true,
//         min: 1,
//         max: 12
//     },
//     year: {
//         type: Number,
//         required: true
//     },
//     basicSalary: {
//         type: Number,
//         required: true
//     },
//     allowances: {
//         type: Number,
//         default: 0
//     },
//     bonuses: {
//         type: Number,
//         default: 0
//     },
//     deductions: {
//         type: Number,
//         default: 0
//     },
//     tax: {
//         type: Number,
//         default: 0
//     },
//     netPay: {
//         type: Number,
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['Pending', 'Processing', 'Paid', 'Cancelled'],
//         default: 'Pending'
//     },
//     paymentDate: {
//         type: Date
//     },
//     paymentMethod: {
//         type: String,
//         enum: ['Bank Transfer', 'Check', 'Cash', 'Other'],
//         default: 'Bank Transfer'
//     },
//     notes: {
//         type: String
//     }
// }, {
//     timestamps: true
// });

// // Compound index to ensure one payroll per employee per month/year
// PayrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

// const Payroll = mongoose.model('Payroll', PayrollSchema);

// export default Payroll;

import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
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
  basicSalary: {
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
  netPay: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  payslipUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Add compound index to ensure one payroll per employee per month-year
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

const Payroll = mongoose.model('Payroll', payrollSchema);

export default Payroll;