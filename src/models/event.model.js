import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String },
    location: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true, default: 0 },
    totalTickets: { type: Number, required: true, default: 0 },
    soldTickets: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
        default: 'PENDING'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    adminNote: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
