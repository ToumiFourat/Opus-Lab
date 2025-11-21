import { Request, Response } from 'express';
import Role from '../models/role.model';
import Permission from '../models/permission.model';
import { body, validationResult } from 'express-validator';

export const validateCreateRole = [
  body('name').isString().notEmpty().withMessage('Nom du rôle requis'),
  body('permissions').optional().isArray().withMessage('Permissions doit être un tableau'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.create({ name, permissions });
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: 'Erreur création rôle', error: (err as Error).message });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const total = await Role.countDocuments();
  const roles = await Role.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('permissions');
  res.json({
    roles,
    page,
    totalPages: Math.ceil(total / limit),
    totalCount: total
  });
};

export const getRole = async (req: Request, res: Response) => {
  const role = await Role.findById(req.params.id).populate('permissions');
  if (!role) return res.status(404).json({ message: 'Rôle non trouvé' });
  res.json(role);
};

export const validateUpdateRole = [
  body('name').optional().isString().notEmpty().withMessage('Nom du rôle requis'),
  body('permissions').optional().isArray().withMessage('Permissions doit être un tableau'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissions },
      { new: true }
    ).populate('permissions');
    if (!role) return res.status(404).json({ message: 'Rôle non trouvé' });
    res.json(role);
  } catch (err) {
    res.status(400).json({ message: 'Erreur maj rôle', error: (err as Error).message });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const role = await Role.findByIdAndDelete(req.params.id);
  if (!role) return res.status(404).json({ message: 'Rôle non trouvé' });
  res.json({ message: 'Rôle supprimé' });
};
