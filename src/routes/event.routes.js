import express from 'express';
import * as eventController from '../controllers/event.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', eventController.findAll);
router.get('/my-events', protect, restrictTo('ORGANIZER'), eventController.findMyEvents);
router.get('/:id', eventController.findOne);

router.post('/', protect, restrictTo('ORGANIZER', 'ADMIN'), upload.single('image'), eventController.create);
router.patch('/:id', protect, restrictTo('ORGANIZER', 'ADMIN'), upload.single('image'), eventController.update);
router.delete('/:id', protect, restrictTo('ORGANIZER', 'ADMIN'), eventController.remove);

export default router;
