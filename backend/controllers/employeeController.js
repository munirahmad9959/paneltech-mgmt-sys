// controllers/employeeController.js
import Employee from '../models/Employee.js';
import User from '../models/User.js';

// Get all employees with profile status
// export const getAllEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.aggregate([
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'userId',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },
//       { $unwind: '$user' },
//       {
//         $project: {
//           profileStatus: 1,
//           department: 1,
//           position: 1,
//           status: 1,
//           'user._id': 1,
//           'user.fullName': 1,
//           'user.email': 1,
//           'user.profileImage': 1
//         }
//       },
//       { $sort: { 'user.fullName': 1 } }
//     ]);
//     console.log('Fetched employees inside the getAllEmployees controller:', employees); // Debugging line

//     res.status(200).json({
//       success: true,
//       data: employees
//     });
//   } catch (error) {
//     console.error('Error fetching employees:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch employees'
//     });
//   }
// };

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $addFields: {
          user: {
            _id: '$user._id',
            fullName: '$user.fullName',
            email: '$user.email',
            profileImage: '$user.profileImage'
          }
        }
      },
      { $sort: { 'user.fullName': 1 } }
    ]);

    console.log('Fetched employees inside the getAllEmployees controller:', employees);

    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees'
    });
  }
};



// Get employee details by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findOne({ userId: id })
      .populate('userId', 'fullName email profileImage dateOfBirth address cnic');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee details'
    });
  }
};

// Update employee profile
export const updateEmployeeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Update employee record
    const updatedEmployee = await Employee.findOneAndUpdate(
      { userId: id },
      { 
        ...updateData,
        profileStatus: 'complete' // Automatically set to complete when admin updates
      },
      { new: true, runValidators: true }
    );

    // Update user record if needed (address, cnic, etc.)
    if (updateData.address || updateData.cnic || updateData.dateOfBirth) {
      await User.findByIdAndUpdate(
        id,
        {
          address: updateData.address,
          cnic: updateData.cnic,
          dateOfBirth: updateData.dateOfBirth
        },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      data: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee profile'
    });
  }
};