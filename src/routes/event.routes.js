import express from 'express';
import * as eventController from '../controllers/event.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', eventController.findAll);
router.get('/my-events', protect, restrictTo('ORGANIZER'), eventController.findMyEvents);
router.get('/:id', eventController.findOne);

router.post('/', protect, restrictTo('ORGANIZER', 'ADMIN'), eventController.create);
router.patch('/:id', protect, restrictTo('ORGANIZER', 'ADMIN'), eventController.update);
router.delete('/:id', protect, restrictTo('ORGANIZER', 'ADMIN'), eventController.remove);

export default router;
