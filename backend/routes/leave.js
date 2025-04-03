import express from 'express';
import { 
    applyLeave, 
    getLeaves, 
    updateLeaveStatus,
    cancelLeave
} from '../controllers/leave.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/apply', authenticateUser, authorizeRoles("employee"), applyLeave);
router.get('/', authenticateUser, authorizeRoles("employee", "admin"), getLeaves);
router.put('/:id/status', authenticateUser, authorizeRoles("admin"), updateLeaveStatus);
router.delete('/:id', authenticateUser, authorizeRoles("employee"), cancelLeave);

export default router;