import * as ticketService from '../services/ticket.service.js';
import catchAsync from '../utils/catchAsync.js';

export const create = catchAsync(async (req, res) => {
    const ticket = await ticketService.create(req.body, req.user._id, req.user.role);
    res.status(201).json(ticket);
});

export const update = catchAsync(async (req, res) => {
    const ticket = await ticketService.update(req.params.id, req.body, req.user._id, req.user.role);
    res.status(200).json(ticket);
});

export const remove = catchAsync(async (req, res) => {
    await ticketService.remove(req.params.id, req.user._id, req.user.role);
    res.status(200).json({ message: 'Ticket deleted successfully' });
});

export const findAll = catchAsync(async (req, res) => {
    const tickets = await ticketService.findAll(req.query);
    res.status(200).json(tickets);
});
