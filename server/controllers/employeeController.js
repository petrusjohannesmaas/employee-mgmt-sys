import { Employee } from '../models/Employee.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getEmployees = async (req, res) => {
    try {
        // Only fetch active employees unless admin perhaps, but let's keep it simple: return all active, or all for admin.
        const query = req.user.role === 'admin' ? {} : { status: 'active' };
        const employees = await Employee.find(query);
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Server error retrieving employees' });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Server error retrieving employee' });
    }
};

export const createEmployee = async (req, res) => {
    try {
        const { password, ...employeeData } = req.body;

        // Validate password for new employees
        if (!password) {
            return res.status(400).json({ error: 'Password is required to create a new employee' });
        }

        // 1. Create the Employee
        const newEmployee = await Employee.create(employeeData);

        // 2. Hash Password and Create the User representation
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await User.create({
            email: newEmployee.email, // using same email for the User document
            passwordHash,
            employeeId: newEmployee._id,
            role: newEmployee.role
        });

        await ActivityLog.create({
            employeeId: req.user.employeeId, // Assuming admin who creates it
            action: `Created employee: ${newEmployee.id}`
        });

        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        await ActivityLog.create({
            employeeId: req.user.employeeId,
            action: `Updated employee: ${employee.id}`
        });

        res.json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        // Soft delete
        const employee = await Employee.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        await ActivityLog.create({
            employeeId: req.user.employeeId,
            action: `Deleted (soft) employee: ${employee.id}`
        });

        res.json({ message: 'Employee disabled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error deleting employee' });
    }
};
