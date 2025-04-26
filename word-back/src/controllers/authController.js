import * as authService from '../services/authService.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../utils/sendResponse.js';
import AppError from '../utils/AppError.js';

export const registerController = catchAsync(async (req, res, next) => {
  console.log('Register controller called');
  const { email, password, username } = req.body;
  const user = await authService.registerUser(email, password, username);

  sendResponse(res, 201, { user }, 'Kayıt başarılı');
});



export const loginController = catchAsync(async (req, res, next) => {
    console.log('Login controller called');
    const { email, password } = req.body;
  
    if (!email || !password) {
      return next(AppError.badRequest('Email ve şifre gereklidir.'));
    }
  
    const { user,token } = await authService.loginUser(email, password);
  
    sendResponse(res, 200, { user,token }, 'Giriş başarılı');
  });
  
