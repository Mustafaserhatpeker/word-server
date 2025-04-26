// src/routes/userRoutes.js
import express from 'express';
import { getAllUsersController,getUserByIdController} from '../controllers/userController.js';
import { protect } from '../middlewares/protectionHandler.js';

const router = express.Router();

router.get('/get-all-users', getAllUsersController);
router.get('/get-user',protect, getUserByIdController);


export default router;
