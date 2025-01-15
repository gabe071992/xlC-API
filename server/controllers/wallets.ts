import { Response } from 'express';
import { db } from '../config/firebase';
import { APIError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';
import { ethers } from 'ethers';

export const createWallet = async (req: AuthRequest, res: Response) => {
  try {
    const wallet = ethers.Wallet.createRandom();

    await db.ref(`wallets/${wallet.address}`).set({
      owner: req.user?.uid,
      createdAt: new Date().toISOString(),
      balance: "0",
    });

    res.status(201).json({
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
    });
  } catch (error) {
    throw new APIError('Wallet creation failed', 400, 'WALLET_002');
  }
};

export const getWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { address } = req.params;
    const walletSnapshot = await db.ref(`wallets/${address}`).once('value');

    if (!walletSnapshot.exists()) {
      throw new APIError('Wallet not found', 404, 'WALLET_003');
    }

    const transactionsSnapshot = await db.ref(`transactions/${address}`).once('value');

    res.json({
      address,
      ...walletSnapshot.val(),
      transactions: transactionsSnapshot.val() || [],
    });
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Failed to fetch wallet', 500, 'WALLET_004');
  }
};

export const transferFunds = async (req: AuthRequest, res: Response) => {
  try {
    const { address } = req.params;
    const { destination, amount, gasLimit } = req.body;

    // Implement actual transfer logic here
    // This is a mock implementation
    const transaction = {
      from: address,
      to: destination,
      amount,
      gasLimit,
      timestamp: new Date().toISOString(),
    };

    await db.ref(`transactions/${address}/${transaction.timestamp}`).set(transaction);

    res.json({ transaction });
  } catch (error) {
    throw new APIError('Transfer failed', 400, 'WALLET_001');
  }
};