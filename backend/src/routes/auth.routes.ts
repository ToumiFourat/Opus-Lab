import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/signup', authController.validateSignup, authController.signup);
router.post('/login', authController.validateLogin, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/reset-password', authController.resetPassword);
router.post('/reset-password/confirm', authController.resetPasswordConfirm);
router.post('/verify-email', authController.verifyEmail);

export default router;
