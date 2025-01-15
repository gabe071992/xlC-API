import express from 'express';
import { createWallet, getWallet, transferFunds } from '../controllers/wallets';
import { authenticateToken } from '../middleware/auth';
import { walletLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/', authenticateToken, createWallet);
router.get('/:address', authenticateToken, walletLimiter, getWallet);
router.post('/:address/transfer', authenticateToken, walletLimiter, transferFunds);

export default router;
