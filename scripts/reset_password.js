
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/user.model.js';

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');

        const email = 'test1@example.com';
        const newPassword = 'User@123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (user) {
            console.log(`Password for ${email} has been reset to ${newPassword}`);
        } else {
            console.log(`User ${email} not found. Creating it...`);
            await User.create({
                name: 'Test User',
                email,
                password: hashedPassword,
                role: 'USER'
            });
            console.log(`User ${email} created with password ${newPassword}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
};

resetPassword();
