import express, { type Express } from "express";
import { createServer } from "http";
import cors from 'cors';
import { errorHandler } from './middleware/error';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import walletRoutes from './routes/wallets';
import stakingRoutes from './routes/staking';

export function registerRoutes(app: Express): ReturnType<typeof createServer> {
  // Enable CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // API Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/wallets', walletRoutes);
  app.use('/api/v1/staking', stakingRoutes);

  // Error handling
  app.use(errorHandler);

  const httpServer = createServer(app);
  return httpServer;
}
