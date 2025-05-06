export const handleRoomJoin = (io, socket, roomMessages, roomWaitList, roomInitialized, roomTurn, roomTimers, getUsername) => {
    socket.on('joinRoom', ({ roomId, timerDuration }) => { // Süre front-end'den alınıyor
        const username = getUsername();
        if (!username) return;

        if (roomInitialized[roomId]) {
            socket.join(roomId);
            socket.emit('roomHistory', roomMessages[roomId] || []);
            io.to(roomId).emit('systemMessage', `${username} odaya katıldı`);
            return;
        }

        if (!roomWaitList[roomId]) roomWaitList[roomId] = [];

        if (roomWaitList[roomId].length === 0) {
            roomWaitList[roomId].push({ socketId: socket.id, username });
            socket.emit('waiting', `${roomId} odasına katılmak için başka bir kullanıcı bekleniyor`);
        } else {
            const waitingUser = roomWaitList[roomId].shift();
            const waitingSocket = io.sockets.sockets.get(waitingUser.socketId);

            socket.join(roomId);
            waitingSocket.join(roomId);
            roomInitialized[roomId] = true;

            if (!roomMessages[roomId]) roomMessages[roomId] = [];

            socket.emit('roomHistory', roomMessages[roomId]);
            waitingSocket.emit('roomHistory', roomMessages[roomId]);

            io.to(roomId).emit('systemMessage', `${username} ve ${waitingUser.username} odaya katıldı`);

            // Sıra belirle (rastgele)
            const firstPlayer = Math.random() < 0.5 ? username : waitingUser.username;
            roomTurn[roomId] = firstPlayer;

            io.to(roomId).emit('systemMessage', `🎲 İlk sırada ${firstPlayer} başlayacak.`);

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
        io.to(roomId).emit('systemMessage', `${username} odadan ayrıldı`);
    });
};

// Timer başlatıcı fonksiyon
function startTurnTimer(io, roomId, username, roomTimers, roomMessages, roomTurn) {
    const duration = roomTimers[roomId]?.duration || (2 * 60 * 1000); // Varsayılan süre: 2 dakika

    if (roomTimers[roomId]?.timeoutId) {
        clearTimeout(roomTimers[roomId].timeoutId);
    }

    const timeoutId = setTimeout(() => {
        if (roomTurn[roomId] === username) {
            io.to(roomId).emit('systemMessage', `⏰ ${username} zamanında yanıt vermedi. Oda kapatıldı.`);

            const sockets = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            sockets.forEach((id) => {
                const sock = io.sockets.sockets.get(id);
                if (sock) sock.disconnect();
            });

            delete roomMessages[roomId];
            delete roomTurn[roomId];
            delete roomTimers[roomId];
        }
    }, duration);

    // 👇👇👇 Yeni emit satırları
    io.to(roomId).emit("turnChange", username); // sadece sıradaki kişi bilgisi
    io.to(roomId).emit("turnStarted", {
        username,
        duration,
        startTime: Date.now(),
    });

    roomTimers[roomId].timeoutId = timeoutId;
}


export { startTurnTimer };