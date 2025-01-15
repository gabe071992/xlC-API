import { Response } from 'express';
import { auth } from '../config/firebase';
import { db } from '../config/firebase';
import { APIError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await db.ref(`users/${userRecord.uid}`).set({
      email,
      name,
      preferences: req.body.preferences || {},
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ userId: userRecord.uid });
  } catch (error) {
    throw new APIError('User creation failed', 400, 'USER_001');
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const userRecord = await auth.getUser(userId);
    const snapshot = await db.ref(`users/${userId}`).once('value');

    res.json({
      ...userRecord,
      ...snapshot.val(),
    });
  } catch (error) {
    throw new APIError('User not found', 404, 'USER_002');
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    await auth.updateUser(userId, updates);
    await db.ref(`users/${userId}`).set(updates);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    throw new APIError('User update failed', 400, 'USER_003');
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    await auth.deleteUser(userId);
    await db.ref(`users/${userId}`).set(null);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    throw new APIError('User deletion failed', 400, 'USER_004');
  }
};