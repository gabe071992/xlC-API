import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many requests', code: 'API_001' },
});

export const userLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute for user operations
  message: { error: 'Too many requests', code: 'API_001' },
});

export const walletLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests', code: 'API_001' },
});

export const stakingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests', code: 'API_001' },
});