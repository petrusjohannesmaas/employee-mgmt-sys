import { Employee } from '../models/Employee.js';
import { ActivityLog } from '../models/ActivityLog.js';

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
        const newEmployee = await Employee.create(req.body);

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

export const incrementActivity = async (req, res) => {
    try {
        const employeeId = req.params.id;
        // Log a sales increment
        const log = await ActivityLog.create({
            employeeId: employeeId,
            action: 'Sales incremented'
        });
        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Error logging activity' });
    }
};
