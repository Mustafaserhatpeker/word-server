import express from 'express';
import userRoutes from './userRoutes.js'; 
import authRoutes from './authRoutes.js';
import fileRoutes from './fileRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/files', fileRoutes);

export default router;
