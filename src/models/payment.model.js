import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    provider: { type: String, required: true }, // STRIPE, RAZORPAY
    transactionId: { type: String },
    status: { type: String, required: true }, // SUCCESS, FAILED
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
