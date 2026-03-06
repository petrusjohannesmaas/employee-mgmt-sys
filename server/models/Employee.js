import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

// Create a virtual field `id` from `_id`
employeeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
employeeSchema.set('toJSON', { virtuals: true });

export const Employee = mongoose.model('Employee', employeeSchema);
