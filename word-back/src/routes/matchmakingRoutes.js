// src/routes/matchmakingRoutes.js

import express from 'express';
import { findMatchController } from '../controllers/matchmakingController.js';
import { protect } from '../middlewares/protectionHandler.js';

const router = express.Router();

router.post('/find', protect, findMatchController);

export default router;
