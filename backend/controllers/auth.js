import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';


export const register = async (req, res) => {
    try {
        console.log("Incoming request:", req.body);

        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("Password hash:", passwordHash);

        const newUser = new User({ fullName, email, password: passwordHash, role: role || "employee" });

        const savedUser = await newUser.save();
        console.log("User registered successfully:", savedUser);

        if (savedUser.role === "employee") {
            const newEmployee = new Employee({
                userId: savedUser._id,
                department: "",
                position: "",
                basicSalary: "",
                joiningDate: "",
                taxInfo: "",
                bankDetails: "",
                cv: ""
            });

            await newEmployee.save();
            console.log("Employee record created:", newEmployee);
        }

        res.status(201).json({ message: "User registered successfully.", user: savedUser });

    } catch (error) {
        console.error("Error in register function:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials." });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const employeeData = await Employee.findOne({ userId: user._id }).lean();

        const fullUserData = {
            user: user.toObject(),           
            employee: employeeData || null  
        };
        console.log('User data:', fullUserData);

        res.status(200).json({
            message: 'Login successful',
            token,
            data: fullUserData
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const logout = (req, res) => {
    console.log("Logout Called");

    res.status(200).json({ message: "Logout successful. Please remove the token from your client-side storage." });
};