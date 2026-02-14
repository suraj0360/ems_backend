import User from '../models/user.model.js';
import Event from '../models/event.model.js';
import Booking from '../models/booking.model.js';

export const getDashboardStats = async (userId, role) => {
    if (role === 'ADMIN') {
        const [totalUsers, totalEvents, totalBookings, revenueData] = await Promise.all([
            User.countDocuments(),
            Event.countDocuments(),
            Booking.countDocuments(),
            Booking.aggregate([
                { $match: { status: { $ne: 'CANCELLED' } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        ]);

        return {
            totalUsers,
            totalEvents,
            totalBookings,
            totalRevenue: revenueData[0]?.total || 0,
        };
    }

    if (role === 'ORGANIZER') {
        const events = await Event.find({ organizer: userId }).select('_id');
        const eventIds = events.map(e => e._id);

        const [myEvents, myBookings, revenueData] = await Promise.all([
            Event.countDocuments({ organizer: userId }),
            Booking.countDocuments({ event: { $in: eventIds } }),
            Booking.aggregate([
                {
                    $match: {
                        event: { $in: eventIds },
                        status: { $ne: 'CANCELLED' }
                    }
                },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        ]);

        return {
            totalEvents: myEvents,
            totalBookings: myBookings,
            totalRevenue: revenueData[0]?.total || 0,
        };
    }

    return {};
};
