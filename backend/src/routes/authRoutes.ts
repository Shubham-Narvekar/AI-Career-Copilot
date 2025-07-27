import { Router } from 'express';
import { register, login, updateProfile } from '../controllers/authController';
import { authenticateJWT, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile', authenticateJWT, updateProfile);
router.get('/protected', authenticateJWT, (req, res) => {
    const user = (req as AuthRequest).user;
    res.json({ message: 'You have accessed a protected route!', user });
});

export default router; 