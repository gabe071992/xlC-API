import { Response } from 'express';
import { db } from '../config/firebase';
import { APIError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';

export const getStakingPools = async (_req: AuthRequest, res: Response) => {
  try {
    const snapshot = await db.ref('staking/pools').once('value');
    res.json(snapshot.val() || []);
  } catch (error) {
    throw new APIError('Failed to fetch staking pools', 500, 'STAKE_002');
  }
};

export const createStake = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, poolId } = req.body;

    if (!amount || !poolId) {
      throw new APIError('Amount and pool ID are required', 400, 'STAKE_003');
    }

    const poolSnapshot = await db.ref(`staking/pools/${poolId}`).once('value');
    const pool = poolSnapshot.val();

    if (!pool) {
      throw new APIError('Pool not found', 404, 'STAKE_004');
    }

    if (amount < pool.minStake) {
      throw new APIError('Minimum stake not met', 400, 'STAKE_001');
    }

    const stakeId = Date.now().toString();
    const stake = {
      id: stakeId,
      userId: req.user?.uid,
      amount,
      poolId,
      status: 'active',
      createdAt: new Date().toISOString(),
      rewards: "0",
    };

    await db.ref(`stakes/${stakeId}`).set(stake);
    res.status(201).json(stake);
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Stake creation failed', 500, 'STAKE_005');
  }
};

export const getStake = async (req: AuthRequest, res: Response) => {
  try {
    const { stakeId } = req.params;
    const snapshot = await db.ref(`stakes/${stakeId}`).once('value');

    if (!snapshot.exists()) {
      throw new APIError('Stake not found', 404, 'STAKE_006');
    }

    res.json(snapshot.val());
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Failed to fetch stake', 500, 'STAKE_007');
  }
};

export const unstake = async (req: AuthRequest, res: Response) => {
  try {
    const { stakeId } = req.params;
    const stakeSnapshot = await db.ref(`stakes/${stakeId}`).once('value');

    if (!stakeSnapshot.exists()) {
      throw new APIError('Stake not found', 404, 'STAKE_006');
    }

    const stake = stakeSnapshot.val();

    // Check if user owns the stake
    if (stake.userId !== req.user?.uid) {
      throw new APIError('Unauthorized', 403, 'STAKE_008');
    }

    // Validate lockup period
    const poolSnapshot = await db.ref(`staking/pools/${stake.poolId}`).once('value');
    const pool = poolSnapshot.val();
    const stakeDuration = Date.now() - new Date(stake.createdAt).getTime();

    if (stakeDuration < pool.lockupPeriod) {
      throw new APIError('Lockup period not completed', 400, 'STAKE_009');
    }

    await db.ref(`stakes/${stakeId}`).set({
      ...stake,
      status: 'unstaked',
      unstakeDate: new Date().toISOString(),
    });

    res.json({ message: 'Successfully unstaked' });
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Unstake failed', 500, 'STAKE_010');
  }
};