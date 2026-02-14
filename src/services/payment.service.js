import Payment from '../models/payment.model.js';
import Booking from '../models/booking.model.js';
import AppError from '../utils/appError.js';
import mongoose from 'mongoose';

export const processPayment = async (paymentData, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { bookingId, provider } = paymentData;

        const booking = await Booking.findById(bookingId).session(session);
        if (!booking) throw new AppError('Booking not found', 404);
        if (booking.user.toString() !== userId.toString()) throw new AppError('Not your booking', 403);
        if (booking.status !== 'PENDING') throw new AppError('Booking already processed or cancelled', 400);

        // Mock Payment Processing
        const transactionId = `txn_${Date.now()}`;
        const status = 'SUCCESS';

        const payment = await Payment.create([{
            booking: bookingId,
            amount: booking.totalAmount,
            currency: 'INR',
            provider,
            transactionId,
            status
        }], { session });

        booking.status = 'CONFIRMED';
        await booking.save({ session });

        await session.commitTransaction();
        return payment[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
