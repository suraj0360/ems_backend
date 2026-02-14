import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './src/models/event.model.js';
import TicketType from './src/models/ticketType.model.js';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to DB');

        const events = await Event.find({ totalTickets: { $gt: 0 } });
        console.log(`Found ${events.length} events with logic > 0 tickets.`);

        for (const event of events) {
            const ticketCount = await TicketType.countDocuments({ event: event._id });
            if (ticketCount === 0) {
                console.log(`Event ${event.title} (${event._id}) has no tickets. Creating default ticket...`);
                await TicketType.create({
                    name: 'Standard Entry',
                    price: event.price || 0,
                    quantity: event.totalTickets,
                    event: event._id
                });
                console.log('Created TicketType for event:', event.title);
            } else {
                console.log(`Event ${event.title} already has tickets.`);
            }
        }
        console.log('Backfill complete.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
