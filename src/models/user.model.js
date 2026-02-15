import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ['USER', 'ORGANIZER', 'ADMIN'],
        default: 'USER'
    },
    refreshToken: { type: String, select: false },
    isBlocked: { type: Boolean, default: false },
    companyName: { type: String },
    bio: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
