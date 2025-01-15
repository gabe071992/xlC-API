import { Request, Response } from 'express';
import { auth } from '../config/firebase';
import { APIError } from '../middleware/error';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const verifyConnection = async (_req: Request, res: Response) => {
  try {
    // Test if we can access Firebase Admin SDK
    await auth.listUsers(1);
    res.json({ status: 'Firebase Admin SDK connected', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Firebase connection error:', error);
    throw new APIError('Firebase Admin SDK connection failed', 500, 'AUTH_007');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new APIError('Email and password are required', 400, 'AUTH_004');
    }

    // First verify if user exists
    const userRecord = await auth.getUserByEmail(email)
      .catch(() => {
        throw new APIError('User not found', 404, 'AUTH_001');
      });

    // Create a custom token for the user
    const token = await auth.createCustomToken(userRecord.uid);

    res.json({ 
      token,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      }
    });
  } catch (error) {
    if (error instanceof APIError) throw error;
    console.error('Authentication error:', error);
    throw new APIError('Authentication failed', 401, 'AUTH_001');
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new APIError('Token is required', 400, 'AUTH_006');
    }

    // Verify the token first
    const decodedToken = await auth.verifyIdToken(token);

    // Check if token is close to expiry (within 5 minutes)
    const tokenExp = decodedToken.exp * 1000; // Convert to milliseconds
    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() + fiveMinutes < tokenExp) {
      throw new APIError('Token is still valid', 400, 'AUTH_008');
    }

    // Create a new custom token
    const newToken = await auth.createCustomToken(decodedToken.uid);

    res.json({ 
      token: newToken,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    if (error instanceof APIError) throw error;
    throw new APIError('Token refresh failed', 401, 'AUTH_002');
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      throw new APIError('User ID is required', 400, 'AUTH_005');
    }

    // Revoke all refresh tokens for the user
    await auth.revokeRefreshTokens(uid);
    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    throw new APIError('Logout failed', 400, 'AUTH_005');
  }
};