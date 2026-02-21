import Contact from '../models/contact.model.js';
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
