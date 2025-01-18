
import express, { type Express } from "express";
import cors from 'cors';
import { errorHandler } from './middleware/error';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import walletRoutes from './routes/wallets';
import stakingRoutes from './routes/staking';

export function registerRoutes() {
  const router = express.Router();

  // Enable CORS
  router.use(cors({
    origin: 'https://xlnt-connect.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));

  // API Routes
  router.use('/auth', authRoutes);
  router.use('/users', userRoutes);
  router.use('/wallets', walletRoutes);
  router.use('/staking', stakingRoutes);

  // Error handling
  router.use(errorHandler);

  return router;
}
