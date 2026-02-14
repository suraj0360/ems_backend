import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., VIP, General
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }, // Total available
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
}, { timestamps: true });

const TicketType = mongoose.model('TicketType', ticketTypeSchema);
export default TicketType;
