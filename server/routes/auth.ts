import express from 'express';
import { login, logout, refreshToken, verifyConnection } from '../controllers/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Health check endpoint
router.get('/health', verifyConnection);
router.post('/login', authLimiter, login);
router.post('/refresh', authLimiter, refreshToken);
router.post('/logout', authenticateToken, logout);

export default router;