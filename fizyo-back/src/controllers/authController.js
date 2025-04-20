import * as authService from '../services/authService.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../utils/sendResponse.js';



export const registerController = catchAsync(async (req, res, next) => {
    const { email, password, name } = req.body;
    const user = await authService.registerUser(email, password, name);
  
    sendResponse(res, 201, { user }, 'Kayıt başarılı');
  });
