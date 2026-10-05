import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        studentId: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, enum: ['student', 'admin'], default: 'student' }
    },
    { timestamps: true }
);

userSchema.pre('save', async function hashPassword() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(plain) {
    return bcrypt.compare(plain, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
    return {
        id: this._id.toString(),
        name: this.name,
        email: this.email,
        studentId: this.studentId,
        role: this.role
    };
};

export const User = mongoose.model('User', userSchema);
