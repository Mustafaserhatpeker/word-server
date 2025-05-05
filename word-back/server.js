// server.js
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './src/config/database.js';


const PORT = process.env.PORT || 5001;

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

});
