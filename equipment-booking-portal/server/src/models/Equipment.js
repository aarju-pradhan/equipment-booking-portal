import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, trim: true },
        name: { type: String, required: true, trim: true },
        type: { type: String, enum: ['Equipment', 'Facility'], required: true },
        category: { type: String, required: true, trim: true },
        status: { type: String, enum: ['Available', 'In Use', 'Maintenance'], default: 'Available' },
        description: { type: String, required: true, trim: true },
        image: { type: String, default: '' },
        campusId: { type: String, default: 'miller' },
        campusName: { type: String, default: 'NSW – Miller Street Campus' },
        address: { type: String, default: 'Level 5, 213 Miller Street, North Sydney NSW 2060' },
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    },
    { timestamps: true }
);

equipmentSchema.methods.toClient = function toClient() {
    return {
        id: this._id.toString(),
        code: this.code,
        name: this.name,
        type: this.type,
        category: this.category,
        status: this.status,
        description: this.description,
        image: this.image,
        campusId: this.campusId,
        campusName: this.campusName,
        address: this.address,
        lat: this.lat,
        lng: this.lng
    };
};

export const Equipment = mongoose.model('Equipment', equipmentSchema);
