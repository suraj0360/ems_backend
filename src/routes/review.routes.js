import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Allow anyone to read reviews for an event
router.get('/event/:eventId', reviewController.getReviewsForEvent);

// Protect route to post reviews
router.use(protect);
router.post('/', reviewController.createReview);

export default router;
