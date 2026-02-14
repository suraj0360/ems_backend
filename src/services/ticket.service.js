import TicketType from '../models/ticketType.model.js';
import Event from '../models/event.model.js';
import AppError from '../utils/appError.js';

export const create = async (ticketData, userId, userRole) => {
    const event = await Event.findById(ticketData.eventId);
    if (!event) throw new AppError('Event not found', 404);

    if (userRole !== 'ADMIN' && event.organizer.toString() !== userId.toString()) {
        throw new AppError('You are not authorized to add tickets to this event', 403);
    }

    return TicketType.create({
        name: ticketData.name,
        price: ticketData.price,
        quantity: ticketData.quantity,
        event: ticketData.eventId
    });
};

export const update = async (id, updateData, userId, userRole) => {
    const ticket = await TicketType.findById(id).populate('event');
    if (!ticket) throw new AppError('Ticket not found', 404);

    if (userRole !== 'ADMIN' && ticket.event.organizer.toString() !== userId.toString()) {
        throw new AppError('You are not authorized to update this ticket', 403);
    }

    Object.assign(ticket, updateData);
    await ticket.save();
    return ticket;
};

export const remove = async (id, userId, userRole) => {
    const ticket = await TicketType.findById(id).populate('event');
    if (!ticket) throw new AppError('Ticket not found', 404);

    if (userRole !== 'ADMIN' && ticket.event.organizer.toString() !== userId.toString()) {
        throw new AppError('You are not authorized to delete this ticket', 403);
    }

    await ticket.deleteOne();
    return { success: true };
};

export const findAll = async (query) => {
    const filter = {};
    if (query.eventId) {
        filter.event = query.eventId;
    }
    return TicketType.find(filter).populate('event', 'title date');
};
