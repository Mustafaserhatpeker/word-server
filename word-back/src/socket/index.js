import { handleAuth } from './auth.js';
import { handleRoomJoin } from './roomManager.js';
import { handleSendWord } from './messageHandler.js';
import { handleDisconnect } from './disconnectHandler.js';

export const socketHandler = (io) => {
    const roomMessages = {};
    const roomWaitList = {};
    const roomInitialized = {};
    const roomTurn = {}; // Sıra bilgisi
    const roomTimers = {}; // her oda için timeout ID'leri


    io.on('connection', (socket) => {
        console.log('🔌 A user connected:', socket.id);
        let username = null;

        handleAuth(socket, (decodedUsername) => {
            username = decodedUsername;
            socket.username = username; // socket nesnesine kullanıcıyı ata
        });

        handleRoomJoin(io, socket, roomMessages, roomWaitList, roomInitialized, roomTurn, roomTimers, () => username);
        handleSendWord(io, socket, roomMessages, roomTurn, roomTimers, () => username);
        handleDisconnect(socket, roomWaitList);
    });
};
