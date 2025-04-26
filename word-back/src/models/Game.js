// src/models/Game.js
import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  players: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  duration: { type: Number }, // Dakika
  startedAt: { type: Date, default: Date.now },
  moves: [
    {
      player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      word: { type: String },
      playedAt: { type: Date, default: Date.now }
    }
  ],
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'finished'],
    default: 'in_progress'
  },
  currentTurn: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
