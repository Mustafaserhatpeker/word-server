// src/routes/userRoutes.js
import express from 'express';
import { getAllUsersController} from '../controllers/userController.js';

const router = express.Router();

router.get('/get-all-users', getAllUsersController);


export default router;
