import { startTurnTimer } from './roomManager.js';

export const handleSendWord = (io, socket, roomMessages, roomTurn, roomTimers, getUsername) => {
    socket.on('sendWord', ({ roomId, word }) => {
        const username = getUsername();
        if (!username || !roomId || !word) return;

        if (roomTurn[roomId] !== username) {
            socket.emit('systemMessage', '⛔ It is not your turn!');
            return;
        }

        const msg = `[${username}] sent a word: ${word}`;
        if (!roomMessages[roomId]) roomMessages[roomId] = [];
        roomMessages[roomId].push(msg);
        io.to(roomId).emit('wordResponse', msg);

        // Sırayı değiştir
        const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        const usernamesInRoom = socketsInRoom
            .map(id => io.sockets.sockets.get(id)?.username)
            .filter(Boolean);

        const nextTurn = usernamesInRoom.find(u => u !== username);
        roomTurn[roomId] = nextTurn;

        io.to(roomId).emit('systemMessage', `🔁 Now it's ${nextTurn}'s turn.`);

        // Yeni süre başlat
        startTurnTimer(io, roomId, nextTurn, roomTimers, roomMessages, roomTurn);
    });
};
