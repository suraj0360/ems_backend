import express from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', protect, restrictTo('ADMIN', 'ORGANIZER'), analyticsController.getDashboardStats);

export default router;
