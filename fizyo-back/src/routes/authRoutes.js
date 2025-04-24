// src/routes/userRoutes.js
import express from 'express';
import {  registerController,loginController } from '../controllers/authController.js';
import { registerDoctorController,loginDoctorController } from '../controllers/doctorController.js';
import { protect } from '../middlewares/protectionHandler.js';
const router = express.Router();
//selam

router.post('/register', registerController);
router.post('/register/doctor', registerDoctorController);
router.post('/login/doctor', loginDoctorController);
router.post('/login', loginController, protect);

export default router;
