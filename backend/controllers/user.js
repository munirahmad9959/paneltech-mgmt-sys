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


import path from 'path';
import fs from 'fs';
import multer from 'multer';
import User from '../models/User.js'; // <-- Import User model

// Setup Multer Storage
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

export const upload = multer({ storage: storage });


// Save User Controller
export const saveUserData = async (req, res) => {
    try {
        const fields = req.body;
        const files = req.files;

        // Validation for required fields
        if (!fields.fullName || !fields.email || !fields.password) {
            return res.status(400).json({ message: "fullName, email, and password are required." });
        }

        const newUser = new User({
            fullName: fields.fullName,
            email: fields.email,
            password: fields.password,
            role: fields.role || 'employee', // Optional, defaults to 'employee'

            // Uploaded file URLs
            profileImage: files?.profileImage ? `/uploads/${files.profileImage[0].filename}` : '',
            cnicFront: files?.cnicFront ? `/uploads/${files.cnicFront[0].filename}` : '',
            cnicBack: files?.cnicBack ? `/uploads/${files.cnicBack[0].filename}` : '',
            cv: files?.cv ? `/uploads/${files.cv[0].filename}` : '',

            // Optional fields
            dateOfBirth: fields.dateOfBirth || null,
            cnic: fields.cnic || '',
            address: fields.address || ''
        });

        const savedUser = await newUser.save();

        console.log('Saved User:', savedUser);

        res.status(201).json({
            message: 'User saved successfully!',
            data: savedUser
        });

    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
