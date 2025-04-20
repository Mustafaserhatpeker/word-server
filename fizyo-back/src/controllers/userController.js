import * as userService from '../services/userService.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../utils/sendResponse.js';
export const getAllUsersController = catchAsync(async (req, res, next) => {
   
    const users = await userService.getAllUsers();
    sendResponse(res, 200, users);
  }
);
