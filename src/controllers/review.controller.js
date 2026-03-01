import Review from '../models/review.model.js';
import Event from '../models/event.model.js';
import Booking from '../models/booking.model.js';
import mongoose from 'mongoose';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const createReview = catchAsync(async (req, res, next) => {
    const { eventId, rating, comment } = req.body;
    const userId = req.user._id;

    // 1. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
        return next(new AppError('Event not found', 404));
    }

    // 2. Ensure event has passed to allow reviews
    if (new Date(event.date) >= new Date()) {
        return next(new AppError('You can only review events that have already taken place', 400));
    }

    // 3. Ensure the user actually booked this event
    const booking = await Booking.findOne({ user: userId, event: eventId, status: 'CONFIRMED' });
    if (!booking) {
        return next(new AppError('You must book and attend this event before reviewing', 403));
    }

    // 4. Create Review
    try {
        const review = await Review.create({
            user: userId,
            event: eventId,
            rating,
            comment
        });

        res.status(201).json({
            status: 'success',
            data: review
        });
    } catch (err) {
        if (err.code === 11000) { // Duplicate key
            return next(new AppError('You have already submitted a review for this event', 400));
        }
        return next(err);
    }
});

export const getReviewsForEvent = catchAsync(async (req, res, next) => {
    const { eventId } = req.params;

    const reviews = await Review.find({ event: eventId })
        .populate('user', 'name')
        .sort('-createdAt');

    // Aggregate to get average rating
    const stats = await Review.aggregate([
        { $match: { event: new mongoose.Types.ObjectId(eventId) } },
        {
            $group: {
                _id: '$event',
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: reviews,
        stats: stats.length > 0 ? stats[0] : { avgRating: 0, numReviews: 0 }
    });
});
