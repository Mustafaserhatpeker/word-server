import express from 'express';
import userRoutes from './userRoutes.js'; // Örnek alt route

const router = express.Router();

router.use('/users', userRoutes);

export default router;
