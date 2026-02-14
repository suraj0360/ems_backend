import express from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', bookingController.create);
router.get('/my-bookings', bookingController.findAll);
router.patch('/:id/cancel', bookingController.cancel);

export default router;
