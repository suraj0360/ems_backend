import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../src/models/booking.model.js';
import User from '../src/models/user.model.js';
import Event from '../src/models/event.model.js';
import * as analyticsService from '../src/services/analytics.service.js';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to DB');

        // 1. List all bookings
        const bookings = await Booking.find({});
        console.log(`\nFound ${bookings.length} bookings:`);
        bookings.forEach(b => {
            console.log(`- ID: ${b._id}, Event: ${b.event}, Status: ${b.status}, Qty: ${b.quantity}, Amount: ${b.totalAmount}`);
        });

        // 2. Test Analytics for an Organizer
        // Find an organizer who has events
        const organizer = await User.findOne({ role: 'ORGANIZER' });
        if (organizer) {
            console.log(`\nTesting stats for Organizer: ${organizer.email} (${organizer._id})`);
            const stats = await analyticsService.getDashboardStats(organizer._id, 'ORGANIZER');
            console.log('Organizer Stats:', stats);
        } else {
            console.log('\nNo Organizer found.');
        }

        // 3. Test Analytics for Admin
        const admin = await User.findOne({ role: 'ADMIN' });
        if (admin) {
            console.log(`\nTesting stats for Admin: ${admin.email}`);
            const stats = await analyticsService.getDashboardStats(admin._id, 'ADMIN');
            console.log('Admin Stats:', stats);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
