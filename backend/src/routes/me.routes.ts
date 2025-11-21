import { Router } from 'express';
import { getMe } from '../controllers/me.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, getMe);

export default router;
