// server.js
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './src/config/database.js';
import { registerSocketHandlers } from './src/socket/socketHandler.js';

const PORT = process.env.PORT || 5000;

// Express app'i HTTP sunucusuna sarıyoruz
const server = http.createServer(app);

// Socket.IO sunucusunu başlatıyoruz
const io = new Server(server, {
  cors: {
    origin: '*', // Gerekirse burayı özelleştir
    methods: ['GET', 'POST'],
  },
});

connectDB().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });

  // Socket event handler'ları burada başlatılacak
  registerSocketHandlers(io);
});
