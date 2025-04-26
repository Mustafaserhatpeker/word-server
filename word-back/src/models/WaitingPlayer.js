// src/models/WaitingPlayer.js
import mongoose from 'mongoose';

const waitingPlayerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  duration: { type: Number }, // Dakika cinsinden (örneğin: 2, 5, 10, 60, 1440)
  createdAt: { type: Date, default: Date.now }
});

const WaitingPlayer = mongoose.model('WaitingPlayer', waitingPlayerSchema);

export default WaitingPlayer;
