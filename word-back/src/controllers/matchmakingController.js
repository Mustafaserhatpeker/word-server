// src/controllers/matchmakingController.js

import * as matchmakingService from '../services/matchmakingService.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../utils/sendResponse.js';

export const findMatchController = catchAsync(async (req, res, next) => {
  const { duration } = req.body;
  const userId = req.user.id; 

  const game = await matchmakingService.findOrCreateMatch(userId, duration);

  sendResponse(res, 200, { game }, 'Eşleşme bulundu veya yeni oyun oluşturuldu.');
});
