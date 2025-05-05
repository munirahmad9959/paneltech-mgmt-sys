// routes/employeeRoutes.js
import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  updateEmployeeProfile
} from '../controllers/employeeController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';


const router = express.Router();

router.route('/')
  .get(authenticateUser, authorizeRoles("admin"), getAllEmployees);

router.route('/:id')
  .get(authenticateUser, authorizeRoles("admin"), getEmployeeById)
  .put(authenticateUser, authorizeRoles("admin"), updateEmployeeProfile);

export default router;