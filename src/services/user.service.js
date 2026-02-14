import User from '../models/user.model.js';
import AppError from '../utils/appError.js';

export const findById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return user;
};

export const update = async (id, updateData) => {
    const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!user) throw new AppError('User not found', 404);
    return user;
};

export const findAll = async () => {
    return User.find().select('name email role isBlocked createdAt');
};

export const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError('User not found', 404);
    return { success: true };
};
