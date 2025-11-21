import { Router } from 'express';
import * as roleController from '../controllers/role.controller';

const router = Router();
import { authenticateJWT } from '../middleware/auth.middleware';
router.use(authenticateJWT);

router.post('/', roleController.validateCreateRole, roleController.createRole);
router.get('/', roleController.getRoles);
router.get('/:id', roleController.getRole);
router.put('/:id', roleController.validateUpdateRole, roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

export default router;
