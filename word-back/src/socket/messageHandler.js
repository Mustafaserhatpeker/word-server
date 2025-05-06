import { startTurnTimer } from './roomManager.js';

export const handleSendWord = (io, socket, roomMessages, roomTurn, roomTimers, getUsername) => {
    socket.on('sendWord', ({ roomId, word }) => {
        const username = getUsername();
        if (!username || !roomId || !word) return;

        if (roomTurn[roomId] !== username) {
            socket.emit('systemMessage', '⛔ Sıra sizde değil!');
            return;
        }

        const msg = `[${username}] bir kelime gönderdi: ${word}`;
        if (!roomMessages[roomId]) roomMessages[roomId] = [];
        roomMessages[roomId].push(msg);
        io.to(roomId).emit('wordResponse', msg);

        // Sıradaki diğer kullanıcıyı bul (tur dönüşümlü)
        const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        const usernamesInRoom = socketsInRoom
            .map(id => io.sockets.sockets.get(id)?.username)
            .filter(Boolean);

        // Basit döngüsel sıralama
        const currentIndex = usernamesInRoom.indexOf(username);
        const nextIndex = (currentIndex + 1) % usernamesInRoom.length;
        const nextTurn = usernamesInRoom[nextIndex];

        roomTurn[roomId] = nextTurn;
        io.to(roomId).emit('systemMessage', `🔁 Şimdi sıra ${nextTurn}'de.`);

        // Yeni sıradaki oyuncu için timer başlat
        startTurnTimer(io, roomId, nextTurn, roomTimers, roomMessages, roomTurn);
    });
};
