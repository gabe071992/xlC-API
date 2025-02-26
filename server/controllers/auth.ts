import { Request, Response } from 'express';
import { auth, db } from '../config/firebase';
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
    console.log('[AUTH] Login attempt started');
    const { email, password } = req.body;
    console.log('[AUTH] Request body received:', { email, passwordReceived: !!password });

    if (!email || !password) {
      console.log('[AUTH] Missing credentials');
      throw new APIError('Email and password are required', 400, 'AUTH_004');
    }

    // First verify if user exists
    console.log('[AUTH] Attempting to verify user with Firebase');
    const userRecord = await auth.getUserByEmail(email)
      .catch((error) => {
        console.log('[AUTH] Firebase user verification failed:', error);
        throw new APIError('User not found', 404, 'AUTH_001');
      });
    console.log('[AUTH] User verified successfully');

    // Create a custom token with expiration
    console.log('[AUTH] Creating custom token');
    const token = await auth.createCustomToken(userRecord.uid);
    console.log('[AUTH] Custom token created successfully');
    
    // Generate refresh token
    const refreshToken = await auth.createCustomToken(userRecord.uid, {
      expiresIn: '7d',
      refreshToken: true
    });

    // Store refresh token in database
    await db.ref(`userTokens/${userRecord.uid}/refreshToken`).set({
      token: refreshToken,
      createdAt: new Date().toISOString()
    });

    console.log('[AUTH] Preparing response payload');
    const response = { 
      token,
      refreshToken,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      }
    };
    console.log('[AUTH] Sending response');
    res.json(response);
    console.log('[AUTH] Response sent successfully');
  } catch (error) {
    console.log('[AUTH] Error in login process:', error);
    if (error instanceof APIError) throw error;
    console.error('Authentication error:', error);
    throw new APIError('Authentication failed', 401, 'AUTH_001');
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new APIError('Refresh token is required', 400, 'AUTH_006');
    }

    // Verify refresh token
    const decodedToken = await auth.verifyIdToken(refreshToken);

    // Check if refresh token exists in database
    const tokenRef = await db.ref(`userTokens/${decodedToken.uid}/refreshToken`).get();
    const storedToken = tokenRef.val();

    if (!storedToken || storedToken.token !== refreshToken) {
      throw new APIError('Invalid refresh token', 401, 'AUTH_002');
    }

    // Generate new tokens
    const newToken = await auth.createCustomToken(decodedToken.uid);
    const newRefreshToken = await auth.createCustomToken(decodedToken.uid, {
      expiresIn: '7d',
      refreshToken: true
    });

    // Update refresh token in database
    await db.ref(`userTokens/${decodedToken.uid}/refreshToken`).set({
      token: newRefreshToken,
      createdAt: new Date().toISOString()
    });

    res.json({ 
      token: newToken,
      refreshToken: newRefreshToken,
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
    const { uid } = req.user;

    if (!uid) {
      throw new APIError('User ID is required', 400, 'AUTH_005');
    }

    // Remove refresh token from database
    await db.ref(`userTokens/${uid}/refreshToken`).remove();
    
    // Revoke all refresh tokens for the user
    await auth.revokeRefreshTokens(uid);

    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    throw new APIError('Logout failed', 400, 'AUTH_005');
  }
};