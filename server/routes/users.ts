import express from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../controllers/users';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { userLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// User creation doesn't need auth token as it's for registration
router.post('/', userLimiter, createUser);

// Protected routes requiring authentication
router.get('/:userId', authenticateToken, userLimiter, getUser);
router.put('/:userId', authenticateToken, userLimiter, updateUser);
router.delete('/:userId', authenticateToken, isAdmin, userLimiter, deleteUser);

export default router;