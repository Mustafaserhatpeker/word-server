import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './src/config/database.js';
import { socketHandler } from './src/socket/index.js';

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});


socketHandler(io);

connectDB().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
