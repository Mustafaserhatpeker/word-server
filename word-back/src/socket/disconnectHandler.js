// word-back/src/socket/disconnectHandler.js
export const handleDisconnect = (socket, roomWaitList) => {
    socket.on('disconnect', () => {
        for (const roomId in roomWaitList) {
            roomWaitList[roomId] = roomWaitList[roomId].filter(user => user.socketId !== socket.id);
        }
        console.log('❌ A user disconnected:', socket.id);
    });
};
