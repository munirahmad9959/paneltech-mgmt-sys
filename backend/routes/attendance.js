import express from 'express';
import { checkIn, checkOut, getAttendanceRecords } from '../controllers/attendance.js';

const router = express.Router();

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/:userId', getAttendanceRecords);

export default router;
