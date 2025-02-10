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
    picturePath: {
      type: String,
      default: "",
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default
        : "user",
    }
  },
  { timestamps: true, collection: "users" } 
);

const User = mongoose.model("User", userSchema);

export default User;
