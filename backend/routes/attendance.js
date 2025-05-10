// import express from "express";
// import { checkIn, checkOut, getAllAttendanceRecords, getAttendanceRecords } from "../controllers/attendance.js";
// import { authenticateUser } from "../middleware/authMiddleware.js"; // ✨ CHANGED CODE: Import middleware
// import { authorizeRoles } from "../middleware/roleMiddleware.js"; // ✨ CHANGED CODE: Import middleware

// const router = express.Router();

// router.post("/checkin", authenticateUser, authorizeRoles("employee"), checkIn); // ✨ CHANGED CODE: Protect route
// router.post("/checkout", authenticateUser, authorizeRoles("employee"), checkOut); // ✨ CHANGED CODE: Protect route

// router.get("/:userId", authenticateUser, authorizeRoles("employee", "admin"), getAttendanceRecords); // ✨ CHANGED CODE: Protect route

// router.get("/", authenticateUser, authorizeRoles("admin"), getAllAttendanceRecords); 


// export default router;


import express from "express";
import { 
  checkIn, 
  checkOut, 
  getAllAttendanceRecords, 
  getAttendanceRecords,
  getEmployeeAttendanceRecords 
} from "../controllers/attendance.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/checkin", authenticateUser, authorizeRoles("employee"), checkIn);
router.post("/checkout", authenticateUser, authorizeRoles("employee"), checkOut);

router.get("/:userId", authenticateUser, authorizeRoles("employee"), getAttendanceRecords);
router.get("/", authenticateUser, authorizeRoles("admin"), getAllAttendanceRecords);

router.get("/employee/:employeeId", authenticateUser, authorizeRoles("admin"), getEmployeeAttendanceRecords);
export default router;