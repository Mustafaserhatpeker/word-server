// src/routes/userRoutes.js
import express from 'express';
import { getAllUsersController, registerController } from '../controllers/userController.js';

const router = express.Router();

router.get('/get-all-users', getAllUsersController);
router.post('/register', registerController);

export default router;
