import express from 'express';
import {
  calculateCurrentPayroll,
  getPayrollByPeriod,
  getPayrollHistory,
  approvePayroll,
  rejectPayroll,
  recalculatePayroll,
  getPayrollHistoryByStatus,
  exportPayrollHistory
} from '../controllers/payrollController.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Employee routes
router.get('/current', authenticateUser, calculateCurrentPayroll);
router.get('/history', authenticateUser, getPayrollHistory);
router.get('/:month/:year', authenticateUser, getPayrollByPeriod);

// Admin routes
router.put('/:payrollId/approve', authenticateUser, authorizeRoles("admin"), approvePayroll);
router.put('/:payrollId/reject', authenticateUser, authorizeRoles("admin"), rejectPayroll);
router.put('/:payrollId/recalculate', authenticateUser, authorizeRoles("admin"), recalculatePayroll);
router.get('/history-status', authenticateUser, authorizeRoles("admin"), getPayrollHistoryByStatus);
router.get('/hist-status', authenticateUser, authorizeRoles("admin"), exportPayrollHistory);
export default router;