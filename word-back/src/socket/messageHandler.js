export const handleSendWord = (io, socket, roomMessages, getUsername) => {
    socket.on('sendWord', ({ roomId, word }) => {
        const username = getUsername();
        if (!username || !roomId || !word) {
            console.log('❗ Missing username, room ID, or word!');
            return;
        }

        const msg = `[${username}] sent a word: ${word}`;
        console.log('📝', msg);

        if (!roomMessages[roomId]) roomMessages[roomId] = [];
        roomMessages[roomId].push(msg);
        io.to(roomId).emit('wordResponse', msg);
    });
};
