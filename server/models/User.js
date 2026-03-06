import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    role: { type: String, enum: ['admin', 'manager', 'employee'], required: true }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
userSchema.set('toJSON', { virtuals: true });

export const User = mongoose.model('User', userSchema);
