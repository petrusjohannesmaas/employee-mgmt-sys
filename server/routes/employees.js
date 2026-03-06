import express from 'express';
import {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    incrementActivity
} from '../controllers/employeeController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All employee routes require authentication
router.use(authenticate);

router.get('/', requireRole(['admin', 'manager', 'employee']), getEmployees);
router.get('/:id', requireRole(['admin', 'manager', 'employee']), getEmployeeById);

// Only admins can create, update, or delete
router.post('/', requireRole(['admin']), createEmployee);
router.put('/:id', requireRole(['admin']), updateEmployee);
router.delete('/:id', requireRole(['admin']), deleteEmployee);

// Activity logging endpoint
router.post('/:id/increment', requireRole(['admin', 'manager', 'employee']), incrementActivity);

export default router;
