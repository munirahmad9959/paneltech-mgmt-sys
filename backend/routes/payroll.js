import express from 'express';
import {
  getCurrentPayroll,
  getPayrollHistory,
  generatePayroll,
  processPayrollPayment,
  getPayrollByPeriod
} from '../controllers/payrollController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Employee routes
router.get('/current', authenticateUser, authorizeRoles("employee"), getCurrentPayroll);
router.get('/history', authenticateUser, authorizeRoles("employee"), getPayrollHistory);
router.get('/:month/:year', authenticateUser, authorizeRoles("employee"), getPayrollByPeriod);

// Admin routes
router.post('/generate', authenticateUser, authorizeRoles("admin"), generatePayroll);
router.post('/process', authenticateUser, authorizeRoles("admin"), processPayrollPayment);

export default router;