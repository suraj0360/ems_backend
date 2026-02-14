
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');

        const users = await User.find({}, 'name email role');
        console.log('Users found:', users);

        process.exit(0);
    } catch (error) {
        console.error('Error listing users:', error);
        process.exit(1);
    }
};

listUsers();
