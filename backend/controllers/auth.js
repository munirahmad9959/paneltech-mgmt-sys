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

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("Password hash:", passwordHash);

        // Save new user
        const newUser = new User({ fullName, email, password: passwordHash, role: role || "employee" });

        const savedUser = await newUser.save();
        console.log("User registered successfully:", savedUser);

        // If user is of role "user", add them to Employee collection
        if (savedUser.role === "employee") {
            const newEmployee = new Employee({
                userId: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
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

        // const token = jwt.sign(
        //     {
        //         id: user._id,               // Unique user ID
        //         email: user.email,         // Email claim
        //         role: user.role,           // Role claim
        //         userId: user._id.toString() // UserID claim (similar to .NET)
        //     },
        //     process.env.JWT_SECRET,
        //     { expiresIn: "1d" } // Token expiration
        // );

        // Create JWT token with claims
        const token = jwt.sign(
            {
                id: user._id,               // Unique user ID
                email: user.email,         // Email claim
                role: user.role,           // Role claim
                // UserID claim (similar to .NET)
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Token expiration
        );

        res.status(200).json({ token, user });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    console.log("Logout Called");

    res.status(200).json({ message: "Logout successful. Please remove the token from your client-side storage." });
};