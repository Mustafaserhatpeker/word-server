// src/socket/socketHandler.js
import { startGame } from './gameHandler.js';

export const registerSocketHandlers = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Token gerekli'));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Geçersiz token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Bağlandı: ${socket.user.id}`);

        socket.on('join_game_queue', (gameType) => {
            if (!['2dk', '5dk', '12saat', '24saat'].includes(gameType)) {
                return socket.emit('error', 'Geçersiz oyun türü');
            }

            console.log(`🎮 ${socket.user.id} ${gameType} kuyruğuna katıldı`);
            addToQueue(gameType, socket);
            tryMatchPlayers(gameType, io);
        });

        socket.on('word_submission', (word) => {
            // Burada kelime girişi yapılır, ilgili oyuncunun sırası kontrol edilir
            console.log(`📝 ${socket.user.id} kelime yazdı: ${word}`);
            socket.to(socket.roomId).emit('word_submission', socket.user.id, word);
        });

        socket.on('disconnect', () => {
            Object.keys(gameQueues).forEach((type) => {
                removeFromQueue(type, socket.id);
            });
            console.log(`❌ Ayrıldı: ${socket.user.id}`);
        });
    });
};
