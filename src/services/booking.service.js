import Booking from '../models/booking.model.js';
import TicketType from '../models/ticketType.model.js';
import AppError from '../utils/appError.js';
import mongoose from 'mongoose';

export const create = async (bookingData, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { eventId, ticketTypeId, quantity } = bookingData;

        if (quantity > 10) {
            throw new AppError('Cannot book more than 10 tickets per transaction', 400);
        }

        // Check Event Level Limit
        const event = await mongoose.model('Event').findById(eventId).session(session);
        if (!event) throw new AppError('Event not found', 404);

        if (event.totalTickets > 0 && (event.soldTickets + quantity > event.totalTickets)) {
            throw new AppError('Event sold out or not enough tickets remaining', 400);
        }

        const ticketType = await TicketType.findById(ticketTypeId).session(session);
        if (!ticketType) throw new AppError('Ticket type not found', 404);
        if (ticketType.event.toString() !== eventId) throw new AppError('Ticket does not belong to this event', 400);
        if (ticketType.quantity < quantity) throw new AppError('Not enough tickets available', 400);

        // Decrement quantity
        ticketType.quantity -= quantity;
        await ticketType.save({ session });

        // Increment event sold tickets
        event.soldTickets += quantity;
        await event.save({ session });

        // Calculate total
        const totalAmount = ticketType.price * quantity;

        // Create booking
        const booking = await Booking.create([{
            user: userId, // Assuming user is passed correctly
            event: eventId,
            ticketType: ticketTypeId,
            quantity,
            totalAmount,
            status: 'PENDING'
        }], { session });

        await session.commitTransaction();
        return booking[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const findAllByUser = async (userId) => {
    return Booking.find({ user: userId })
        .populate('event', 'title date location')
        .populate('ticketType', 'name price')
        .sort({ createdAt: -1 });
};

export const cancel = async (id, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const booking = await Booking.findById(id).session(session);
        if (!booking) throw new AppError('Booking not found', 404);
        if (booking.user.toString() !== userId.toString()) throw new AppError('Not your booking', 403);
        if (booking.status === 'CANCELLED') throw new AppError('Already cancelled', 400);

        booking.status = 'CANCELLED';
        await booking.save({ session });

        // Refund ticket quantity
        await TicketType.findByIdAndUpdate(
            booking.ticketType,
            { $inc: { quantity: booking.quantity } },
            { session }
        );

        await session.commitTransaction();
        return { success: true };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
