import { handleAuth } from './auth.js';
import { handleRoomJoin } from './roomManager.js';
import { handleSendWord } from './messageHandler.js';
import { handleDisconnect } from './disconnectHandler.js';

export const socketHandler = (io) => {
    const roomMessages = {};
    const roomWaitList = {};
    const roomInitialized = {};

    io.on('connection', (socket) => {
        console.log('🔌 A user connected:', socket.id);
        let username = null;

        handleAuth(socket, (decodedUsername) => {
            username = decodedUsername;
        });

        handleRoomJoin(io, socket, roomMessages, roomWaitList, roomInitialized, () => username);
        handleSendWord(io, socket, roomMessages, () => username);
        handleDisconnect(socket, roomWaitList);
    });
};
