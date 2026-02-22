import Notification from '../models/notification.model.js';
import catchAsync from '../utils/catchAsync.js';

// Get all notifications for logged-in user
export const getNotifications = catchAsync(async (req, res, next) => {
    const notifications = await Notification.find({ recipient: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50); // Limit to recent 50 for performance

    res.status(200).json({
        status: 'success',
        results: notifications.length,
        data: notifications
    });
});

// Mark a single notification as read
export const markAsRead = catchAsync(async (req, res, next) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.user.id },
        { read: true },
        { new: true, runValidators: true }
    );

    if (!notification) {
        return res.status(404).json({
            status: 'fail',
            message: 'Notification not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: notification
    });
});

// Mark all notifications as read for logged-in user
export const markAllAsRead = catchAsync(async (req, res, next) => {
    await Notification.updateMany(
        { recipient: req.user.id, read: false },
        { read: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'All notifications marked as read'
    });
});
