import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Employee } from './models/Employee.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/employees';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@system.local' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create Admin Employee Profile
        const adminEmployee = await Employee.create({
            firstName: 'System',
            lastName: 'Admin',
            email: 'admin@system.local',
            role: 'admin',
            status: 'active'
        });

        // Create Admin User Account
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);

        await User.create({
            email: 'admin@system.local',
            passwordHash,
            employeeId: adminEmployee._id,
            role: 'admin'
        });

        console.log('Admin user seeded successfully. Email: admin@system.local Password: admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
