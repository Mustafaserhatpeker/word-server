// src/models/Game.js

import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    gameType: {
        type: String,
        required: true,
        enum: ['2dk', '5dk', '12s', '24s'], // Oyun süreleri
    },
    players: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            remainingTime: {
                type: Number, // Saniye cinsinden kalan süre
                required: true,
            },
            words: {
                type: [String], // Kullanıcının yazdığı kelimeler
                default: [],
            },
            isReady: {
                type: Boolean,
                default: false, // Oyuna hazır mı?
            },
            hasLost: {
                type: Boolean,
                default: false, // Hükmen mağlubiyet durumu
            },
        },
    ],
    status: {
        type: String,
        enum: ['waiting', 'in_progress', 'finished'],
        default: 'waiting', // Oyun durumu
    },
    activePlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    turnHistory: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            word: {
                type: String,
                required: true,
            },
            submittedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
