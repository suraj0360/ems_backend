import Event from '../models/event.model.js';
import AppError from '../utils/appError.js';
import TicketType from '../models/ticketType.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

export const create = async (eventData, userId) => {
    if (eventData.date) {
        // Set both dates to midnight for fair comparison
        const eventDate = new Date(eventData.date).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);

        if (eventDate < today) {
            throw new AppError('Event date cannot be in the past', 400);
        }
    }

    const event = await Event.create({
        ...eventData,
        organizer: userId,
        totalTickets: eventData.totalTickets || 0,
        soldTickets: 0
    });

    // Create a default Ticket Type
    if (event.totalTickets > 0) {
        await TicketType.create({
            name: 'Standard Entry',
            price: event.price,
            quantity: event.totalTickets,
            event: event._id
        });
    }

    // Notify all admins about the new event
    try {
        const admins = await User.find({ role: 'ADMIN' });
        const notifications = admins.map(admin => ({
            recipient: admin._id,
            message: `New event created: ${event.title}`,
            type: 'EVENT_UPDATE',
            link: '/admin/dashboard'
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
    } catch (error) {
        console.error("Failed to notify admins of new event:", error);
    }

    return event;
};

export const findAll = async (query) => {
    const { page = 1, limit = 10, search, category } = query;
    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
        ];
    }

    if (category) {
        filter.category = { $regex: category, $options: 'i' };
    }

    const [events, total] = await Promise.all([
        Event.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('organizer', 'name email'),
        Event.countDocuments(filter),
    ]);

    return {
        data: events,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
    };
};

export const findOne = async (id) => {
    const event = await Event.findById(id).populate('organizer', 'name email');
    if (!event) throw new AppError('Event not found', 404);
    return event;
};

export const update = async (id, updateData, userId, userRole) => {
    const event = await Event.findById(id);
    if (!event) throw new AppError('Event not found', 404);

    if (userRole !== 'ADMIN' && event.organizer.toString() !== userId.toString()) {
        throw new AppError('You are not authorized to update this event', 403);
    }

    Object.assign(event, updateData);
    await event.save();
    return event;
};

export const remove = async (id, userId, userRole) => {
    const event = await Event.findById(id);
    if (!event) throw new AppError('Event not found', 404);

    if (userRole !== 'ADMIN' && event.organizer.toString() !== userId.toString()) {
        throw new AppError('You are not authorized to delete this event', 403);
    }

    await event.deleteOne();
    return { success: true };
};

export const findMyEvents = async (userId) => {
    return Event.find({ organizer: userId }).sort({ date: -1 });
};
