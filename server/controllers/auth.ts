import { Request, Response } from 'express';
import { auth } from '../config/firebase';
import { APIError } from '../middleware/error';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new APIError('Email and password are required', 400, 'AUTH_004');
    }

    const userCredential = await auth.getUserByEmail(email);
    // In a real implementation, you would verify the password here
    
    const token = await auth.createCustomToken(userCredential.uid);
    
    res.json({ token });
  } catch (error) {
    throw new APIError('Authentication failed', 401, 'AUTH_001');
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;
    await auth.revokeRefreshTokens(uid);
    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    throw new APIError('Logout failed', 400, 'AUTH_005');
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new APIError('Refresh token is required', 400, 'AUTH_006');
    }

    const token = await auth.createCustomToken(refreshToken);
    res.json({ token });
  } catch (error) {
    throw new APIError('Token refresh failed', 401, 'AUTH_002');
  }
};
