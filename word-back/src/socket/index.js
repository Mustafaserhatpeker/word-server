import jwt from 'jsonwebtoken';

export const socketHandler = (io) => {
    const roomMessages = {}; // Tracks message history for each room
    const roomWaitList = {}; // Tracks users waiting in each room
    const roomInitialized = {}; // Tracks whether a room is initialized

    io.on('connection', (socket) => {
        console.log('🔌 A user connected:', socket.id);

        let username = null;

        // Authenticate the user
        socket.on('authenticate', ({ token }) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                username = decoded.username; // Extract username from token
                console.log(`✅ User authenticated: ${username}`);
            } catch (err) {
                console.log('❌ Token verification failed');
                socket.emit('unauthorized');
                socket.disconnect();
            }
        });

        // Join a room
        socket.on('joinRoom', (roomId) => {
            if (!username) {
                console.log('❗ Authentication is required first!');
                return;
            }

            // If the room is already initialized, allow direct joining
            if (roomInitialized[roomId]) {
                socket.join(roomId);
                console.log(`✅ ${username} joined room ${roomId}`);

                // Send room history to the user
                socket.emit('roomHistory', roomMessages[roomId] || []);

                // Notify room members
                io.to(roomId).emit('systemMessage', `${username} joined the room`);
                return;
            }

            // Add user to the waiting list for the room
            if (!roomWaitList[roomId]) {
                roomWaitList[roomId] = [];
            }

            // Check if the room already has someone waiting
            if (roomWaitList[roomId].length === 0) {
                // No one else is waiting, put the user on hold
                roomWaitList[roomId].push({ socketId: socket.id, username });
                console.log(`⏳ ${username} is waiting for another user to join room ${roomId}`);
                socket.emit('waiting', `Waiting for another user to join room ${roomId}`);
            } else {
                // Another user is already waiting, pair them together
                const waitingUser = roomWaitList[roomId].shift(); // Remove the first waiting user
                const waitingSocket = io.sockets.sockets.get(waitingUser.socketId);

                // Allow both users to join the room
                socket.join(roomId);
                waitingSocket.join(roomId);

                // Mark the room as initialized
                roomInitialized[roomId] = true;

                console.log(`✅ ${username} and ${waitingUser.username} joined room ${roomId}`);

                // Initialize room message history if it doesn't exist
                if (!roomMessages[roomId]) {
                    roomMessages[roomId] = [];
                }

                // Send room history to both users
                socket.emit('roomHistory', roomMessages[roomId]);
                waitingSocket.emit('roomHistory', roomMessages[roomId]);

                // Notify room members
                io.to(roomId).emit('systemMessage', `${username} and ${waitingUser.username} have joined the room`);
            }
        });

        // Send a word event
        socket.on('sendWord', ({ roomId, word }) => {
            if (!username || !roomId || !word) {
                console.log('❗ Authentication is missing, room ID or word is invalid!');
                return;
            }

            const msg = `[${username}] sent a word: ${word}`;
            console.log('📝', msg);

            // Mesajı odaya ekle ve yayınla
            if (!roomMessages[roomId]) {
                roomMessages[roomId] = []; // Eğer oda geçmişi yoksa bir dizi başlat
            }
            roomMessages[roomId].push(msg);
            io.to(roomId).emit('wordResponse', msg);
        });

        // Leave the room
        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
            console.log(`❌ ${username} left room ${roomId}`);
            io.to(roomId).emit('systemMessage', `${username} has left the room`);
        });

        // Disconnect event
        socket.on('disconnect', () => {
            // Remove user from all wait lists
            for (const roomId in roomWaitList) {
                roomWaitList[roomId] = roomWaitList[roomId].filter(user => user.socketId !== socket.id);
            }

            console.log('❌ A user disconnected:', socket.id);
        });
    });
};