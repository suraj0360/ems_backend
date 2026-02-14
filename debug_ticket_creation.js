import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './src/models/event.model.js';
import TicketType from './src/models/ticketType.model.js';
import { create as createEvent } from './src/services/event.service.js';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to DB');

        // Clean up previous test events if needed
        // await Event.deleteMany({ title: 'Test Event Tickets' });

        const userId = new mongoose.Types.ObjectId(); // Mock user ID

        const eventData = {
            title: 'Test Event Tickets ' + Date.now(),
            description: 'Testing ticket creation',
            date: new Date(),
            time: '10:00',
            location: 'Test Location',
            category: 'Social',
            price: 100,
            totalTickets: 50,
            image: 'http://example.com/image.png'
        };

        console.log('Creating event with data:', eventData);

        const event = await createEvent(eventData, userId);
        console.log('Event created:', event._id);

        const tickets = await TicketType.find({ event: event._id });
        console.log('Tickets found for event:', tickets.length);
        console.log(tickets);

        if (tickets.length > 0 && tickets[0].quantity === 50) {
            console.log('SUCCESS: Ticket created correctly');
        } else {
            console.log('FAILURE: Ticket not created or incorrect quantity');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
