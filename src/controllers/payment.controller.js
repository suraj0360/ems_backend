import * as paymentService from '../services/payment.service.js';
import catchAsync from '../utils/catchAsync.js';

export const processPayment = catchAsync(async (req, res) => {
    const payment = await paymentService.processPayment(req.body, req.user._id);
    res.status(201).json(payment);
});
