import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['INFO', 'EVENT_UPDATE', 'SYSTEM'],
        default: 'INFO'
    },
    read: {
        type: Boolean,
        default: false
    },
    link: {
        type: String // Optional link to redirect user when clicking the notification
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
