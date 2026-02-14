import * as userService from '../services/user.service.js';
import catchAsync from '../utils/catchAsync.js';

export const getProfile = catchAsync(async (req, res) => {
    const user = await userService.findById(req.user._id);
    res.status(200).json(user);
});

export const updateProfile = catchAsync(async (req, res) => {
    const user = await userService.update(req.user._id, req.body);
    res.status(200).json(user);
});

export const findAll = catchAsync(async (req, res) => {
    const users = await userService.findAll();
    res.status(200).json(users);
});

export const toggleBlock = catchAsync(async (req, res) => {
    const user = await userService.update(req.params.id, { isBlocked: req.body.isBlocked });
    res.status(200).json(user);
});

export const deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});
