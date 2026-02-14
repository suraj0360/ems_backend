import * as analyticsService from '../services/analytics.service.js';
import catchAsync from '../utils/catchAsync.js';

export const getDashboardStats = catchAsync(async (req, res) => {
    const stats = await analyticsService.getDashboardStats(req.user._id, req.user.role);
    res.status(200).json(stats);
});
