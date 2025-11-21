import { Request, Response } from 'express';
import User from '../models/user.model';
import Token from '../models/token.model';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis.' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Utilisateur déjà existant.' });
    const user = await User.create({ email, password });
    // Générer un token de vérification
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 3600 * 1000); // 24h
    await Token.create({ userId: user._id, token: verifyToken, type: 'verify', expires });
    // Simuler l'envoi d'email : retourner le token dans la réponse
    res.status(201).json({ message: 'Inscription réussie. (token vérification simulé)', verifyToken });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Erreur serveur.', error: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide.' });
    }
    // Générer tokens
    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    await Token.create({ userId: user._id, token: refreshToken, type: 'refresh', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ accessToken });
  } catch {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) await Token.deleteOne({ token: refreshToken });
    res.clearCookie('refreshToken');
    res.json({ message: 'Déconnexion réussie.' });
  } catch {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const oldToken = req.cookies.refreshToken;
    if (!oldToken) return res.status(401).json({ message: 'Non authentifié.' });
    const payload = jwt.verify(oldToken, JWT_REFRESH_SECRET) as any;
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: 'Utilisateur introuvable.' });
    // Générer nouveaux tokens
    const newAccessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    await Token.deleteOne({ token: oldToken });
    await Token.create({ userId: user._id, token: newRefreshToken, type: 'refresh', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(401).json({ message: 'Token invalide.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requis.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
    // Générer un token unique
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600 * 1000); // 1h
    await Token.create({ userId: user._id, token: resetToken, type: 'reset', expires });
    // Simuler l'envoi d'email : retourner le token dans la réponse
    res.json({ message: 'Reset password demandé. (token simulé)', resetToken });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: (err as Error).message });
  }
};

export const resetPasswordConfirm = async (req: Request, res: Response) => {
  try {
    const { token, password, email } = req.body;
    if ((!token && !email) || !password) return res.status(400).json({ message: 'Token ou email et nouveau mot de passe requis.' });
    let user = null;
    if (token) {
      const dbToken = await Token.findOne({ token, type: 'reset', expires: { $gt: new Date() } });
      if (!dbToken) return res.status(400).json({ message: 'Token invalide ou expiré.' });
      user = await User.findById(dbToken.userId);
      await Token.deleteOne({ _id: dbToken._id });
    } else if (email) {
      user = await User.findOne({ email });
    }
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    user.password = password;
    await user.save();
    res.json({ message: 'Mot de passe réinitialisé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: (err as Error).message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token requis.' });
    const dbToken = await Token.findOne({ token, type: 'verify', expires: { $gt: new Date() } });
    if (!dbToken) return res.status(400).json({ message: 'Token invalide ou expiré.' });
    const user = await User.findById(dbToken.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    user.isVerified = true;
    await user.save();
    await Token.deleteOne({ _id: dbToken._id });
    res.json({ message: 'Email vérifié.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: (err as Error).message });
  }
};
