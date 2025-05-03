import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 7,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      maxLength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    profileImage: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    address: {
      type: String,
      default: "",
    },
    cnic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, collection: "users" }
);

const User = mongoose.model("User", userSchema);

export default User;
