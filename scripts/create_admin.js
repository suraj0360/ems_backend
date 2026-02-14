
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/user.model.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');

        const email = 'surajyadav0360@gmail.com';
        const password = 'Admin@123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            existingUser.role = 'ADMIN';
            existingUser.password = hashedPassword;
            await existingUser.save();
            console.log('User updated to ADMIN successfully');
        } else {
            await User.create({
                name: 'Suraj Yadav',
                email,
                password: hashedPassword,
                role: 'ADMIN'
            });
            console.log('Admin user created successfully');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
