// src/models/GameQueue.js

import mongoose from 'mongoose';

const gameQueueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gameType: {
        type: String,
        required: true,
        enum: ['2dk', '5dk', '12s', '24s'], // Oyun türü
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});

const GameQueue = mongoose.model('GameQueue', gameQueueSchema);

export default GameQueue;
