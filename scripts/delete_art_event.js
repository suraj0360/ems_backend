import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../src/models/event.model.js';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to DB');

        const eventId = '69889bf5475d739e079c8397'; // Social Mixer & Chill Night
        const event = await Event.findById(eventId);

        if (!event) {
            console.log(`Event with ID ${eventId} not found.`);
        } else {
            console.log(`Deleting event: ${event.title} (${event._id})`);
            await Event.deleteOne({ _id: eventId });
            console.log('Event deleted successfully.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
