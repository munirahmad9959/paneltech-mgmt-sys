import express from "express";
import { checkIn, checkOut, getAttendanceRecords } from "../controllers/attendance.js";
import { authenticateUser } from "../middleware/authMiddleware.js"; // ✨ CHANGED CODE: Import middleware
import { authorizeRoles } from "../middleware/roleMiddleware.js"; // ✨ CHANGED CODE: Import middleware

const router = express.Router();

router.post("/checkin", authenticateUser, authorizeRoles("employee"), checkIn); // ✨ CHANGED CODE: Protect route
router.post("/checkout", authenticateUser, authorizeRoles("employee"), checkOut); // ✨ CHANGED CODE: Protect route

router.get("/:userId", authenticateUser, authorizeRoles("employee"), getAttendanceRecords); // ✨ CHANGED CODE: Protect route

export default router;
