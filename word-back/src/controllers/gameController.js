// src/controllers/gameController.js

import * as gameService from '../services/gameService.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../utils/sendResponse.js';

export const playWordController = catchAsync(async (req, res, next) => {
  const { gameId } = req.params;
  const { word } = req.body;
  const userId = req.user.id;

  const updatedGame = await gameService.playWord(gameId, userId, word);

  sendResponse(res, 200, { game: updatedGame }, 'Kelime başarıyla oynandı.');
});

export const getGameController = catchAsync(async (req, res, next) => {
  const { gameId } = req.params;

  const game = await gameService.getGameById(gameId);

  sendResponse(res, 200, { game }, 'Oyun bilgisi alındı.');
});
