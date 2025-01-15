import express from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../controllers/users';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', createUser);
router.get('/:userId', authenticateToken, getUser);
router.put('/:userId', authenticateToken, updateUser);
router.delete('/:userId', authenticateToken, isAdmin, deleteUser);

export default router;
