import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

import { body, validationResult } from 'express-validator';

export const validateSignup = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 8 }).withMessage('Mot de passe trop court'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const signup = (req: Request, res: Response) => authService.signup(req, res);
export const validateLogin = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const login = (req: Request, res: Response) => authService.login(req, res);
export const logout = (req: Request, res: Response) => authService.logout(req, res);
export const refreshToken = (req: Request, res: Response) => authService.refreshToken(req, res);
export const resetPassword = (req: Request, res: Response) => authService.resetPassword(req, res);
export const resetPasswordConfirm = (req: Request, res: Response) => authService.resetPasswordConfirm(req, res);
export const verifyEmail = (req: Request, res: Response) => authService.verifyEmail(req, res);
