// src/routes/userRoutes.js
import express from 'express';
import { getAllUsers, register } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/register', register);

export default router;
