import express from 'express';
import * as ticketController from '../controllers/ticket.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, restrictTo('ORGANIZER', 'ADMIN'), ticketController.create);
router.get('/', ticketController.findAll);
router.patch('/:id', protect, restrictTo('ORGANIZER', 'ADMIN'), ticketController.update);
router.delete('/:id', protect, restrictTo('ORGANIZER', 'ADMIN'), ticketController.remove);

export default router;
