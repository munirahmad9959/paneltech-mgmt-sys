// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//       minLength: 7, 
//       maxLength: 50, 
//     },
//     email: {
//       type: String,
//       required: true,
//       maxLength: 50,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minLength: 8,
//     },
//     picturePath: {
//       type: String,
//       default: "",
//     },
//     role:{
//         type: String,
//         enum: ["admin", "employee"],
//         default
//         : "employee",
//     }
//   },
//   { timestamps: true, collection: "users" } 
// );

// const User = mongoose.model("User", userSchema);

// export default User;

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
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },

    // 👇 New Fields (Not Required)
    profileImage: {
      type: String,
      default: "", // will store image path like /uploads/xxx.png
    },
    cnicFront: {
      type: String,
      default: "",
    },
    cnicBack: {
      type: String,
      default: "",
    },
    cv: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    cnic: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    }
  },
  { timestamps: true, collection: "users" }
);

const User = mongoose.model("User", userSchema);

export default User;
