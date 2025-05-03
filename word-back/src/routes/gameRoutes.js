// src/routes/gameRoutes.js

import express from 'express';
import { matchController } from '../controllers/gameController.js';

const router = express.Router();

router.post('/match', matchController);

export default router;
