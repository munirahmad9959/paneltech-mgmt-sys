import mongoose from 'mongoose';

const PayrollSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
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
        enum: ['Pending', 'Processing', 'Paid', 'Cancelled'],
        default: 'Pending'
    },
    paymentDate: {
        type: Date
    },
    paymentMethod: {
        type: String,
        enum: ['Bank Transfer', 'Check', 'Cash', 'Other'],
        default: 'Bank Transfer'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index to ensure one payroll per employee per month/year
PayrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const Payroll = mongoose.model('Payroll', PayrollSchema);

export default Payroll;