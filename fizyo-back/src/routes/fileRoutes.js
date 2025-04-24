// src/routes/fileRoutes.js
import express from 'express';
import { uploadFileController, getFileController } from '../controllers/fileController.js';
import { uploadSingleFile } from '../middlewares/fileUploadMiddleware.js';

const router = express.Router();

router.post('/upload', uploadSingleFile, uploadFileController);
router.get('/:filename', getFileController);

export default router;
