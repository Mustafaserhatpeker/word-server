// src/services/matchmakingService.js

import WaitingPlayer from '../models/WaitingPlayer.js';
import Game from '../models/Game.js';
import AppError from '../utils/AppError.js';

export const findOrCreateMatch = async (userId, duration) => {
  // Önce aynı süre için bekleyen birini bul
  const waitingPlayer = await WaitingPlayer.findOne({ duration });

  if (waitingPlayer) {
    // Eşleşme bulundu, yeni bir oyun oluştur
    const game = await Game.create({
      players: [waitingPlayer.userId, userId],
      duration,
      currentTurn: waitingPlayer.userId, 
    });

    
    await WaitingPlayer.deleteOne({ _id: waitingPlayer._id });

    return game;
  } else {
   
    await WaitingPlayer.create({
      userId,
      duration,
    });

    throw AppError.notFound('Henüz eşleşecek oyuncu bulunamadı. Beklemeye alındın.');
  }
};
