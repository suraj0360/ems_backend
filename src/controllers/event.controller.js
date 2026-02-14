import * as eventService from '../services/event.service.js';
import catchAsync from '../utils/catchAsync.js';

export const create = catchAsync(async (req, res) => {
    const event = await eventService.create(req.body, req.user._id);
    res.status(201).json(event);
});

export const findAll = catchAsync(async (req, res) => {
    const result = await eventService.findAll(req.query);
    res.status(200).json(result);
});

export const findMyEvents = catchAsync(async (req, res) => {
    const events = await eventService.findMyEvents(req.user._id);
    res.status(200).json(events);
});

export const findOne = catchAsync(async (req, res) => {
    const event = await eventService.findOne(req.params.id);
    res.status(200).json(event);
});

export const update = catchAsync(async (req, res) => {
    const event = await eventService.update(req.params.id, req.body, req.user._id, req.user.role);
    res.status(200).json(event);
});

export const remove = catchAsync(async (req, res) => {
    await eventService.remove(req.params.id, req.user._id, req.user.role);
    res.status(200).json({ message: 'Event deleted successfully' });
});
