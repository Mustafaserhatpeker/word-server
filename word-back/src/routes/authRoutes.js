// src/routes/userRoutes.js
import express from 'express';
import { registerController, loginController } from '../controllers/authController.js';

import { protect } from '../middlewares/protectionHandler.js';
const router = express.Router();
router.post('/register', registerController);
router.post('/login', loginController, protect);

export default router;
