import { Router } from 'express';
import * as permissionController from '../controllers/permission.controller';

const router = Router();
import { authenticateJWT } from '../middleware/auth.middleware';
router.use(authenticateJWT);

router.post('/', permissionController.validateCreatePermission, permissionController.createPermission);
router.get('/', permissionController.getPermissions);
router.get('/:id', permissionController.getPermission);
router.put('/:id', permissionController.validateUpdatePermission, permissionController.updatePermission);
router.delete('/:id', permissionController.deletePermission);

export default router;
