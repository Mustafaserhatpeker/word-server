export const handleRoomJoin = (io, socket, roomMessages, roomWaitList, roomInitialized, roomTurn, getUsername) => {
    socket.on('joinRoom', (roomId) => {
        const username = getUsername();
        if (!username) {
            console.log('❗ Authentication is required first!');
            return;
        }

        if (roomInitialized[roomId]) {
            socket.join(roomId);
            console.log(`✅ ${username} joined room ${roomId}`);
            socket.emit('roomHistory', roomMessages[roomId] || []);
            io.to(roomId).emit('systemMessage', `${username} joined the room`);
            return;
        }

        if (!roomWaitList[roomId]) roomWaitList[roomId] = [];

        if (roomWaitList[roomId].length === 0) {
            roomWaitList[roomId].push({ socketId: socket.id, username });
            console.log(`⏳ ${username} is waiting for another user to join room ${roomId}`);
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
        }
    });

    socket.on('leaveRoom', (roomId) => {
        const username = getUsername();
        socket.leave(roomId);
        console.log(`❌ ${username} left room ${roomId}`);
        io.to(roomId).emit('systemMessage', `${username} has left the room`);
    });
};
