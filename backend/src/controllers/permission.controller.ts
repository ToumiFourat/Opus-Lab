import { Request, Response } from 'express';
import Permission from '../models/permission.model';
import { body, validationResult } from 'express-validator';

export const validateCreatePermission = [
  body('name').isString().notEmpty().withMessage('Nom de la permission requis'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const createPermission = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const permission = await Permission.create({ name });
    res.status(201).json(permission);
  } catch (err) {
    res.status(400).json({ message: 'Erreur création permission', error: (err as Error).message });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const total = await Permission.countDocuments();
  const permissions = await Permission.find()
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({
    permissions,
    page,
    totalPages: Math.ceil(total / limit),
    totalCount: total
  });
};

export const getPermission = async (req: Request, res: Response) => {
  const permission = await Permission.findById(req.params.id);
  if (!permission) return res.status(404).json({ message: 'Permission non trouvée' });
  res.json(permission);
};

export const validateUpdatePermission = [
  body('name').optional().isString().notEmpty().withMessage('Nom de la permission requis'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const updatePermission = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!permission) return res.status(404).json({ message: 'Permission non trouvée' });
    res.json(permission);
  } catch (err) {
    res.status(400).json({ message: 'Erreur maj permission', error: (err as Error).message });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  const permission = await Permission.findByIdAndDelete(req.params.id);
  if (!permission) return res.status(404).json({ message: 'Permission non trouvée' });
  res.json({ message: 'Permission supprimée' });
};
