import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Admin-only fields
  department: {
    type: String,
  },
  position: {
    type: String,
  },
  basicSalary: {
    type: Number,
  },
  joiningDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on leave'],
    default: 'active'
  },
  taxInfo: {
    taxId: String,
    taxCategory: String
  },
  // Additional employee documents
  bankDetails: {
    accountNumber: String,
    bankName: String,
    branch: String,
    accountType: String
  },
  cnicDoc: {
    type: String,
    default: "",
  },
  cvDoc: {
    type: String,
    default: "",
  },
}, {
  timestamps: true
});

export default mongoose.model('Employee', EmployeeSchema);
