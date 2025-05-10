import jwt from "jsonwebtoken";
import User from "../models/User.js"; 

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; 

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No Token Provided!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = await User.findById(decoded.id).select("-password"); 

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next(); 
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
