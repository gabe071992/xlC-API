import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { APIError } from './error';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new APIError('No token provided', 401, 'AUTH_001');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
    };

    next();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Token expired or invalid', 401, 'AUTH_002');
  }
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new APIError('Unauthorized', 401, 'AUTH_001');
    }

    const userRecord = await auth.getUser(req.user.uid);
    const customClaims = userRecord.customClaims || {};

    if (!customClaims.admin) {
      throw new APIError('Insufficient permissions', 403, 'AUTH_003');
    }

    next();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Authorization check failed', 500, 'SERVER_001');
  }
};