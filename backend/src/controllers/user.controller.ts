import { Request, Response } from 'express';
import User from '../models/user.model';
import { body, validationResult } from 'express-validator';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc' } = req.query;
    const query: any = {};
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }
    const users = await User.find(query)
      .sort({ [sort as string]: order === 'asc' ? 1 : -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate('roles');
    const total = await User.countDocuments(query);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ message: 'Erreur chargement users', error: (err as Error).message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).populate('roles');
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json(user);
};

export const validateCreateUser = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 8 }).withMessage('Mot de passe trop court'),
  body('roles').optional().isArray().withMessage('Roles doit être un tableau'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, roles } = req.body;
    const user = await User.create({ email, password, roles });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Erreur création user', error: (err as Error).message });
  }
};

export const validateUpdateUser = [
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('password').optional().isLength({ min: 8 }).withMessage('Mot de passe trop court'),
  body('roles').optional().isArray().withMessage('Roles doit être un tableau'),
  body('isVerified').optional().isBoolean().withMessage('isVerified doit être booléen'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email, password, roles, isVerified } = req.body;
    const update: any = { email, roles, isVerified };
    if (password) update.password = password;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).populate('roles');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Erreur maj user', error: (err as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json({ message: 'Utilisateur supprimé' });
};

export const activateUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json(user);
};

export const deactivateUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isVerified: false }, { new: true });
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json(user);
};

export const updateUserRoles = async (req: Request, res: Response) => {
  try {
    const { roles } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { roles },
      { new: true }
    ).populate('roles');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Erreur mise à jour user', error: (err as Error).message });
  }
};
