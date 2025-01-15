import express from 'express';
import { login, logout, refreshToken } from '../controllers/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/login', authLimiter, login);
router.post('/refresh', authLimiter, refreshToken);
router.post('/logout', authenticateToken, logout);

export default router;
