import express from 'express';
import { submitContact, getAllContacts, respondToContact } from '../controllers/contact.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route to submit a form
router.post('/', submitContact);

// Protected admin routes
router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/', getAllContacts);
router.put('/:id/respond', respondToContact);

export default router;
