import path from 'path';
import fs from 'fs';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import mongoose from 'mongoose';

export const saveUserData = async (req, res) => {
    try {
        const fields = req.body;
        console.log('Fields:', fields);
        const files = req.files;
        console.log('Files:', files);

        if (!fields._id || !fields.fullName || !fields.email) {
            return res.status(400).json({ message: "_id, fullName, and email are required." });
        }

        console.log('fields._id:', fields._id);

        const existingUser = await User.findById(fields._id);
        console.log('Existing User:', existingUser);

        if (!existingUser) {
            const newUser = new User({
                _id: fields._id,
                fullName: fields.fullName,
                email: fields.email,
                role: fields.role || 'employee',
                dateOfBirth: fields.dateOfBirth || null,
                cnic: fields.cnic || '',
                address: fields.address || '',
            });

            if (files?.profileImage) {
                newUser.profileImage = `/uploads/${files.profileImage[0].filename}`;
            }

            const savedUser = await newUser.save();
            return res.status(201).json({ message: 'New user created successfully!', user: savedUser });
        }

        const updateData = {
            fullName: fields.fullName,
            email: fields.email,
            dateOfBirth: fields.dateOfBirth || null,
            cnic: fields.cnic || '',
            address: fields.address || '',
        };

        if (files?.profileImage) {
            updateData.profileImage = `/uploads/${files.profileImage[0].filename}`;
            if (existingUser?.profileImage) {
                const oldPath = path.join(process.cwd(), 'public', existingUser.profileImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        const savedUser = await User.findByIdAndUpdate(fields._id, updateData, { new: true });

        if (savedUser.role === 'employee') {
            const employeeUpdateData = {};

            if (files?.cnicDoc) {
                employeeUpdateData.cnicDoc = `/uploads/${files.cnicDoc[0].filename}`;
                const existingEmployee = await Employee.findOne({ userId: savedUser._id });
                if (existingEmployee?.cnicDoc) {
                    const oldPath = path.join(process.cwd(), 'public', existingEmployee.cnicDoc);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
            }

            if (files?.cvDoc) {
                employeeUpdateData.cvDoc = `/uploads/${files.cvDoc[0].filename}`;
                const existingEmployee = await Employee.findOne({ userId: savedUser._id });
                if (existingEmployee?.cvDoc) {
                    const oldPath = path.join(process.cwd(), 'public', existingEmployee.cvDoc);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
            }

            await Employee.findOneAndUpdate(
                { userId: savedUser._id },
                { ...employeeUpdateData, userId: savedUser._id },
                { upsert: true, new: true }
            );
        }
        const employeeData = await Employee.findOne({ userId: savedUser._id }).lean();

        const fullUserData = {
            ...savedUser.toObject(),
            ...employeeData 
        };

        console.log('User data saved successfully:', fullUserData);
        res.status(201).json({ message: 'User data saved successfully!', user: fullUserData });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const getUserData = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let employee = null;

        if (user.role === 'employee') {
            employee = await Employee.findOne({ userId: user._id }).lean();
        }

        const fullUserData = {
            user,       
            employee   
        };

        res.status(200).json({ message: 'User data fetched successfully', data: fullUserData });

    } catch (error) {
        console.error('Error fetching user data in getUserData:', error);
        res.status(500).json({ message: 'Server error in getUserData', error: error.message });
    }
};
