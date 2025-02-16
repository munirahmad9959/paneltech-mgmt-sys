import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    totalHours: {
      type: Number,
      default: 0, // Calculated after check-out
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, collection: "attendance" }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;