import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profileStatus: {
    type: String,
    enum: ['complete', 'incomplete'],
    default: 'incomplete'
  },
  // Admin-only fields
  department: {
    type: String,
  },
  position: {
    type: String,
  },
  hourlyRate: {
    type: Number,
    min: 0,
    default: 0
  },
  joiningDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on leave'],
    default: 'active'
  },
  // Payroll specific fields
  taxInfo: {
    taxId: String,
    taxRate: {
      type: Number,
      default: 0.15 // Default 15% tax rate
    }
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    branch: String,
    accountType: String
  },
  allowances: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  overtimeRate: {
    type: Number,
    default: 1.5 
  },
  standardHours: {
    type: Number,
    default: 160 
  },
  // Documents
  cnicDoc: {
    type: String,
    default: "",
  },
  cvDoc: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for monthly overtime rate
EmployeeSchema.virtual('overtimeHourlyRate').get(function () {
  return this.hourlyRate * this.overtimeRate;
});

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;