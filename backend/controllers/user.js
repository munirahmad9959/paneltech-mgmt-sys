// import path from 'path';
// import fs from 'fs';
// import multer from 'multer';

// // Setup Multer Storage
// const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadsDir);
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + '-' + file.originalname);
//     }
// });

// export const upload = multer({ storage: storage });


// // Save User Controller
// export const saveUserData = (req, res) => {
//     try {
//         const fields = req.body;
//         const files = req.files;

//         const userData = {
//             firstName: fields.firstName,
//             lastName: fields.lastName,
//             dateOfBirth: fields.dateOfBirth,
//             address: fields.address,
//             cnic: fields.cnic,
//             profileImageUrl: files?.profileImage ? `/uploads/${files.profileImage[0].filename}` : '',
//             documents: {
//                 cnicFrontUrl: files?.cnicFront ? `/uploads/${files.cnicFront[0].filename}` : '',
//                 cnicBackUrl: files?.cnicBack ? `/uploads/${files.cnicBack[0].filename}` : '',
//                 cvUrl: files?.cv ? `/uploads/${files.cv[0].filename}` : ''
//             }
//         };

//         console.log('Saved User Data:', userData);

//         res.status(200).json({
//             message: 'User saved successfully!',
//             data: userData
//         });

//     } catch (error) {
//         console.error('Error saving user data:', error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// };


// import path from 'path';
// import fs from 'fs';
// import multer from 'multer';
// import User from '../models/User.js'; // <-- Import User model

// // Setup Multer Storage
// const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadsDir);
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + '-' + file.originalname);
//     }
// });

// export const upload = multer({ storage: storage });


// // Save User Controller
// export const saveUserData = async (req, res) => {
//     try {
//         const fields = req.body;
//         const files = req.files;

//         // Validation for required fields
//         if (!fields._id || !fields.fullName || !fields.email) {
//             return res.status(400).json({ message: "_id, fullName, and email are required." });
//         }

//         const newUser = new User({
//             fullName: fields.fullName,
//             email: fields.email,
//             password: fields.password,
//             role: fields.role || 'employee', // Optional, defaults to 'employee'

//             // Uploaded file URLs
//             profileImage: files?.profileImage ? `/uploads/${files.profileImage[0].filename}` : '',
//             cnicFront: files?.cnicFront ? `/uploads/${files.cnicFront[0].filename}` : '',
//             cnicBack: files?.cnicBack ? `/uploads/${files.cnicBack[0].filename}` : '',
//             cv: files?.cv ? `/uploads/${files.cv[0].filename}` : '',

//             // Optional fields
//             dateOfBirth: fields.dateOfBirth || null,
//             cnic: fields.cnic || '',
//             address: fields.address || ''
//         });

//         const savedUser = await newUser.save();

//         console.log('Saved User:', savedUser);

//         res.status(201).json({
//             message: 'User saved successfully!',
//             data: savedUser
//         });

//     } catch (error) {
//         console.error('Error saving user data:', error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// };


// import path from 'path';
// import fs from 'fs';
// import multer from 'multer';
// import User from '../models/User.js';

// // Setup Multer Storage (unchanged)
// const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadsDir);
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + '-' + file.originalname);
//     }
// });

// export const upload = multer({ storage: storage });

// // Updated Save User Controller
// export const saveUserData = async (req, res) => {
//     try {
//         const fields = req.body;
//         const files = req.files;

//         // Validation for required fields
//         if (!fields._id || !fields.fullName || !fields.email) {
//             return res.status(400).json({ message: "_id, fullName, and email are required." });
//         }

//         // Check if user exists
//         const existingUser = await User.findById(fields._id);

//         // Prepare update data
//         const updateData = {
//             // Immutable fields (only set on creation)
//             ...(!existingUser && {
//                 fullName: fields.fullName,
//                 email: fields.email,
//                 password: fields.password,
//                 role: fields.role || 'employee'
//             }),
//             // Mutable fields
//             dateOfBirth: fields.dateOfBirth || null,
//             cnic: fields.cnic || '',
//             address: fields.address || ''
//         };

//         // Handle file uploads
//         if (files?.profileImage) {
//             updateData.profileImage = `/uploads/${files.profileImage[0].filename}`;
//             // Delete old file if exists
//             if (existingUser?.profileImage) {
//                 const oldFilePath = path.join(process.cwd(), 'public', existingUser.profileImage);
//                 if (fs.existsSync(oldFilePath)) {
//                     fs.unlinkSync(oldFilePath);
//                 }
//             }
//         }

//         if (files?.cnicFront) {
//             updateData.cnicFront = `/uploads/${files.cnicFront[0].filename}`;
//             if (existingUser?.cnicFront) {
//                 const oldFilePath = path.join(process.cwd(), 'public', existingUser.cnicFront);
//                 if (fs.existsSync(oldFilePath)) {
//                     fs.unlinkSync(oldFilePath);
//                 }
//             }
//         }

//         if (files?.cnicBack) {
//             updateData.cnicBack = `/uploads/${files.cnicBack[0].filename}`;
//             if (existingUser?.cnicBack) {
//                 const oldFilePath = path.join(process.cwd(), 'public', existingUser.cnicBack);
//                 if (fs.existsSync(oldFilePath)) {
//                     fs.unlinkSync(oldFilePath);
//                 }
//             }
//         }

//         if (files?.cv) {
//             updateData.cv = `/uploads/${files.cv[0].filename}`;
//             if (existingUser?.cv) {
//                 const oldFilePath = path.join(process.cwd(), 'public', existingUser.cv);
//                 if (fs.existsSync(oldFilePath)) {
//                     fs.unlinkSync(oldFilePath);
//                 }
//             }
//         }

//         // Create or update user
//         let savedUser;
//         if (!existingUser) {
//             savedUser = await new User(updateData).save();
//         } else {
//             savedUser = await User.findByIdAndUpdate(fields._id, updateData, { new: true });
//         }

//         res.status(201).json({
//             message: 'User data saved successfully!',
//             data: savedUser
//         });

//     } catch (error) {
//         console.error('Error saving user data:', error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

// // Add a new controller to get user data
// export const getUserData = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json(user);
//     } catch (error) {
//         console.error('Error fetching user data:', error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

import path from 'path';
import fs from 'fs';
import User from '../models/User.js';

export const saveUserData = async (req, res) => {
    try {
        const fields = req.body;
        const files = req.files;

        if (!fields._id || !fields.fullName || !fields.email) {
            return res.status(400).json({ message: "_id, fullName, and email are required." });
        }

        const existingUser = await User.findById(fields._id);

        const updateData = {
            ...(!existingUser && {
                fullName: fields.fullName,
                email: fields.email,
                password: fields.password,
                role: fields.role || 'employee'
            }),
            dateOfBirth: fields.dateOfBirth || null,
            cnic: fields.cnic || '',
            address: fields.address || ''
        };

        const processFile = (field) => {
            if (files?.[field]) {
                updateData[field] = `/uploads/${files[field][0].filename}`;
                const oldPath = existingUser?.[field] && path.join(process.cwd(), 'public', existingUser[field]);
                if (oldPath && fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        };

        ['profileImage', 'cnicFront', 'cnicBack', 'cv'].forEach(processFile);

        let savedUser;
        if (!existingUser) {
            savedUser = await new User(updateData).save();
        } else {
            savedUser = await User.findByIdAndUpdate(fields._id, updateData, { new: true });
        }

        res.status(201).json({ message: 'User data saved successfully!', data: savedUser });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
