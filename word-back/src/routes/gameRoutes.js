// src/routes/gameRoutes.js

import express from 'express';
import { playWordController, getGameController } from '../controllers/gameController.js';
import { protect } from '../middlewares/protectionHandler.js';

const router = express.Router();

router.post('/:gameId/play', protect, playWordController);
router.get('/:gameId', protect, getGameController);

export default router;
