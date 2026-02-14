import * as bookingService from '../services/booking.service.js';
import catchAsync from '../utils/catchAsync.js';

export const create = catchAsync(async (req, res) => {
    const booking = await bookingService.create(req.body, req.user._id);
    res.status(201).json(booking);
});

export const findAll = catchAsync(async (req, res) => {
    const bookings = await bookingService.findAllByUser(req.user._id);
    res.status(200).json(bookings);
});

export const cancel = catchAsync(async (req, res) => {
    await bookingService.cancel(req.params.id, req.user._id);
    res.status(200).json({ message: 'Booking cancelled successfully' });
});
