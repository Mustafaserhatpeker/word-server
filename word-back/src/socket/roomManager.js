export const handleRoomJoin = (io, socket, roomMessages, roomWaitList, roomInitialized, roomTurn, roomTimers, getUsername) => {
    socket.on('joinRoom', ({ roomId, timerDuration }) => { // Front-end'den süre alınıyor
        const username = getUsername();
        if (!username) return;

        if (roomInitialized[roomId]) {
            socket.join(roomId);
            socket.emit('roomHistory', roomMessages[roomId] || []);
            io.to(roomId).emit('systemMessage', `${username} joined the room`);
            return;
        }

        if (!roomWaitList[roomId]) roomWaitList[roomId] = [];

        if (roomWaitList[roomId].length === 0) {
            roomWaitList[roomId].push({ socketId: socket.id, username });
            socket.emit('waiting', `Waiting for another user to join room ${roomId}`);
        } else {
            const waitingUser = roomWaitList[roomId].shift();
            const waitingSocket = io.sockets.sockets.get(waitingUser.socketId);

            socket.join(roomId);
            waitingSocket.join(roomId);
            roomInitialized[roomId] = true;

            if (!roomMessages[roomId]) roomMessages[roomId] = [];

            socket.emit('roomHistory', roomMessages[roomId]);
            waitingSocket.emit('roomHistory', roomMessages[roomId]);

            io.to(roomId).emit('systemMessage', `${username} and ${waitingUser.username} have joined the room`);

            // Sıra belirle (random)
            const firstPlayer = Math.random() < 0.5 ? username : waitingUser.username;
            roomTurn[roomId] = firstPlayer;

            io.to(roomId).emit('systemMessage', `🎲 ${firstPlayer} will start first.`);

            // Süreyi kaydet
            const durationInMs = (timerDuration || 2) * 60 * 1000; // Varsayılan süre: 2 dakika
            roomTimers[roomId] = { duration: durationInMs };

            // İlk süreyi başlat
            startTurnTimer(io, roomId, firstPlayer, roomTimers, roomMessages, roomTurn);
        }
    });

    socket.on('leaveRoom', (roomId) => {
        const username = getUsername();
        socket.leave(roomId);
        clearTimeout(roomTimers[roomId]?.timeoutId);
        io.to(roomId).emit('systemMessage', `${username} has left the room`);
    });
};

// Timer başlatıcı fonksiyon
function startTurnTimer(io, roomId, username, roomTimers, roomMessages, roomTurn) {
    // Oda süresini al
    const duration = roomTimers[roomId]?.duration || (2 * 60 * 1000); // Varsayılan süre: 2 dakika

    // Daha önceki zamanlayıcıyı temizle
    clearTimeout(roomTimers[roomId]?.timeoutId);

    // Yeni zamanlayıcıyı başlat
    roomTimers[roomId].timeoutId = setTimeout(() => {
        io.to(roomId).emit('systemMessage', `⏰ ${username} did not respond in time. Room is closed.`);
        const sockets = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        sockets.forEach((id) => {
            const sock = io.sockets.sockets.get(id);
            if (sock) sock.disconnect();
        });

        // Temizleme
        delete roomMessages[roomId];
        delete roomTurn[roomId];
        delete roomTimers[roomId];
    }, duration); // Dinamik süre kullanılıyor
}

export { startTurnTimer };