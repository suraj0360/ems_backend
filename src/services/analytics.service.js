import User from '../models/user.model.js';
import Event from '../models/event.model.js';
import Booking from '../models/booking.model.js';

export const getDashboardStats = async (userId, role) => {
    if (role === 'ADMIN') {
        const [totalUsers, totalEvents, reportData] = await Promise.all([
            User.countDocuments(),
            Event.countDocuments(),
            Booking.aggregate([
                { $match: { status: { $ne: 'CANCELLED' } } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalAmount' },
                        totalBookings: { $sum: 1 } // Count of bookings
                    }
                }
            ])
        ]);

        const stats = reportData[0] || { totalRevenue: 0, totalBookings: 0 };

        return {
            totalUsers,
            totalEvents,
            totalBookings: stats.totalBookings,
            revenue: stats.totalRevenue, // Changed key to match
        };
    }

    if (role === 'ORGANIZER') {
        const events = await Event.find({ organizer: userId }).select('_id');
        const eventIds = events.map(e => e._id);

        const [myEvents, reportData] = await Promise.all([
            Event.countDocuments({ organizer: userId }),
            Booking.aggregate([
                {
                    $match: {
                        event: { $in: eventIds },
                        status: { $ne: 'CANCELLED' }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalAmount' },
                        totalTickets: { $sum: '$quantity' }
                    }
                }
            ])
        ]);

        const stats = reportData[0] || { totalRevenue: 0, totalTickets: 0 };

        return {
            totalEvents: myEvents,
            ticketsSold: stats.totalTickets,
            revenue: stats.totalRevenue,
        };
    }

    return {};
};
