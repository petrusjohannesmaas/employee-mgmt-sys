import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

activityLogSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
activityLogSchema.set('toJSON', { virtuals: true });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
