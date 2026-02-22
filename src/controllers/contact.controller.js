import Contact from '../models/contact.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import AppError from '../utils/appError.js';

export const submitContact = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return next(new AppError('Please provide name, email and message', 400));
        }

        const newContact = await Contact.create({
            name,
            email,
            message
        });

        // Notify all admins
        const admins = await User.find({ role: 'ADMIN' });
        const notifications = admins.map(admin => ({
            recipient: admin._id,
            message: `New contact form message from ${name}`,
            type: 'INFO',
            link: '/admin/dashboard'
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({
            status: 'success',
            data: newContact
        });
    } catch (error) {
        next(error);
    }
};

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: contacts.length,
            data: contacts
        });
    } catch (error) {
        next(error);
    }
};

export const respondToContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        if (!response) {
            return next(new AppError('Please provide a response message', 400));
        }

        const contact = await Contact.findByIdAndUpdate(
            id,
            {
                status: 'REPLIED',
                response
            },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return next(new AppError('No contact found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: contact
        });
    } catch (error) {
        next(error);
    }
};
