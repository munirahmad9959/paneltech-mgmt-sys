import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Import User model

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No Token Provided!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
        req.user = await User.findById(decoded.id).select("-password"); // Get user data without password

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next(); // Move to the next middleware/controller
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
