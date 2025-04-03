import mongoose from 'mongoose';

const LeaveSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    leaveType: { 
        type: String, 
        required: true,
        enum: ['annual', 'sick', 'maternity', 'paternity', 'other'],
        default: 'annual'
    },
    reason: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Leave', LeaveSchema);