import express from 'express';
import { getStakingPools, createStake, getStake, unstake } from '../controllers/staking';
import { authenticateToken } from '../middleware/auth';
import { stakingLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.get('/pools', authenticateToken, stakingLimiter, getStakingPools);
router.post('/stakes', authenticateToken, stakingLimiter, createStake);
router.get('/stakes/:stakeId', authenticateToken, stakingLimiter, getStake);
router.delete('/stakes/:stakeId', authenticateToken, stakingLimiter, unstake);

export default router;
