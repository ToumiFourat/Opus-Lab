import { Request, Response } from 'express';
import User from '../models/user.model';
import Role from '../models/role.model';
import Permission from '../models/permission.model';

export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user doit être rempli par le middleware d'auth
    const userId = (req as any).user?._id || (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });
    const user = await User.findById(userId).populate({
      path: 'roles',
      populate: { path: 'permissions' }
    });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    const roles = user.roles.map((r: any) => r.name);
    const permissions = user.roles.flatMap((r: any) => r.permissions.map((p: any) => p.name));
    res.json({ email: user.email, roles, permissions });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: (err as Error).message });
  }
};
