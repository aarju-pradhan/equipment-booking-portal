import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
        date: { type: String, required: true }
    },
    { timestamps: true }
);

bookingSchema.index({ equipment: 1, date: 1 }, { unique: true });

export const Booking = mongoose.model('Booking', bookingSchema);
