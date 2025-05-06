// src/models/User.js
import mongoose from 'mongoose';


const gameScheme = new mongoose.Schema({
    gameStatus: {
        type: String,
        required: true,
        unique: false,
    },
    users: [
        {
            username: {
                type: String,
                required: true,
            },
            socketId: {
                type: String,
                required: true,
            },
            score: {
                type: Number,
                default: 0,
            },
        },
    ],





});


const Game = mongoose.model('Game', gameScheme);

export default Game;
