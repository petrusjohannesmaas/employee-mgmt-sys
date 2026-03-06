import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { ActivityLog } from '../models/ActivityLog.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).populate('employeeId');
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check pass
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check employee status
        if (user.employeeId && user.employeeId.status === 'inactive') {
            return res.status(403).json({ error: 'Account is inactive' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, employeeId: user.employeeId?._id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        // Log activity
        await ActivityLog.create({
            employeeId: user.employeeId._id,
            action: 'login'
        });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                employeeId: user.employeeId?.id
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
};

export const logout = async (req, res) => {
    // In JWT based auth without redis, logout is handled client-side by destroying the token.
    // We can just return success here.
    res.json({ message: 'Logged out successfully' });
};
