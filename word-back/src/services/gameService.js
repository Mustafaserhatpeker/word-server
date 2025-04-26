// src/services/gameService.js

import Game from '../models/Game.js';
import AppError from '../utils/AppError.js';

export const playWord = async (gameId, userId, word) => {
  const game = await Game.findById(gameId);

  if (!game) {
    throw AppError.notFound('Oyun bulunamadı.');
  }

  if (game.currentTurn.toString() !== userId) {
    throw AppError.forbidden('Sıra sende değil.');
  }

  // Hamleyi kaydet
  game.moves.push({
    player: userId,
    word,
  });

  // Sırayı değiştir
  const otherPlayer = game.players.find(player => player.toString() !== userId);
  game.currentTurn = otherPlayer;

  await game.save();

  return game;
};

export const getGameById = async (gameId) => {
  const game = await Game.findById(gameId).populate('players', 'username email');
  
  if (!game) {
    throw AppError.notFound('Oyun bulunamadı.');
  }

  return game;
};
