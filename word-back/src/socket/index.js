//// word-back/src/socket/index.js
import { handleAuth } from './auth.js';
import { handleRoomJoin } from './roomManager.js';
import { handleSendWord } from './messageHandler.js';
import { handleDisconnect } from './disconnectHandler.js';

export const socketHandler = (io) => {
    const roomMessages = {};
    const roomWaitList = {};
    const roomInitialized = {};
    const roomTurn = {};
    const roomTimers = {}; // yeni: süre takip

    io.on('connection', (socket) => {
        console.log('🔌 A user connected:', socket.id);
        let username = null;

        handleAuth(socket, (decodedUsername) => {
            username = decodedUsername;
            socket.username = username;
        });

        handleRoomJoin(io, socket, roomMessages, roomWaitList, roomInitialized, roomTurn, roomTimers, () => username);
        handleSendWord(io, socket, roomMessages, roomTurn, roomTimers, () => username);
        handleDisconnect(socket, roomWaitList);
    });
};
