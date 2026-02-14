import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);

router.get('/', restrictTo('ADMIN'), userController.findAll);
router.patch('/:id/block', restrictTo('ADMIN'), userController.toggleBlock);
router.delete('/:id', restrictTo('ADMIN'), userController.deleteUser);

export default router;
