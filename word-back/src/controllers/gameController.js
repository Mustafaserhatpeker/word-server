// src/controllers/gameController.js

import Game from '../models/Game.js';
import GameQueue from '../models/GameQueue.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const matchController = catchAsync(async (req, res, next) => {
    const { userId, gameType } = req.body;

    // Aynı gameType'a sahip bekleyen oyuncuyu bul
    const waitingPlayer = await GameQueue.findOne({ gameType }).exec();

    if (waitingPlayer && waitingPlayer.userId.toString() !== userId.toString()) {
        // Eşleşme sağlandı, oyun başlatılıyor

        // Bekleyen oyuncuyu ve bu oyuncuyu eşleştir
        const game = new Game({
            gameType,
            players: [
                { userId: waitingPlayer.userId, remainingTime: 60, isReady: true },
                { userId, remainingTime: 60, isReady: true },
            ],
            activePlayer: waitingPlayer.userId, // İlk oyuncu başlar
        });

        // Eşleşen oyuncuları GameQueue'dan çıkar
        await GameQueue.deleteOne({ _id: waitingPlayer._id });

        // Yeni oyunu kaydet
        await game.save();

        // Oyuna yeni oyuncuyu da dahil et
        game.players.push({ userId, remainingTime: 60, isReady: true });
        await game.save();

        return res.status(201).json({
            status: 'success',
            message: 'Eşleşme sağlandı, oyun başlatılıyor!',
            game,
        });
    }

    // Eşleşme sağlanamadı, beklemeye alındı
    const newQueueItem = new GameQueue({
        userId,
        gameType,
    });

    await newQueueItem.save();

    return res.status(200).json({
        status: 'success',
        message: 'Beklemeye alındınız, eşleşme için bekleyin.',
        gameType,
    });
});
