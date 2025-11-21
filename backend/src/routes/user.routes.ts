import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser, activateUser, deactivateUser, updateUserRoles, validateCreateUser, validateUpdateUser } from '../controllers/user.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Route d'inscription publique
router.post('/register', validateCreateUser, createUser);

router.use(authenticateJWT);

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', validateCreateUser, createUser);
router.put('/:id', validateUpdateUser, updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/activate', activateUser);
router.patch('/:id/deactivate', deactivateUser);
router.patch('/:id/roles', updateUserRoles);

export default router;
