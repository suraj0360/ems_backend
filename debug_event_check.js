import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './src/models/event.model.js';
import TicketType from './src/models/ticketType.model.js';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to DB');

        const eventId = '6988c0567b58170b66e758ed';

        console.log(`Checking Event: ${eventId}`);
        const event = await Event.findById(eventId);

        if (!event) {
            console.log('Event NOT FOUND');
        } else {
            console.log('Event Details:', {
                _id: event._id,
                title: event.title,
                price: event.price,
                totalTickets: event.totalTickets,
                soldTickets: event.soldTickets
            });

            const tickets = await TicketType.find({ event: eventId });
            console.log('Tickets found:', tickets.length);
            console.log(tickets);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
