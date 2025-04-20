import { Router } from 'express';
const router = Router();
import { getAllUsersController, createUserController } from '../controllers/userController.js';

router.get('/', getAllUsersController);
router.post('/', createUserController);

export default router;
