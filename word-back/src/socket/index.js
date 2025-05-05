export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('🔌 Bir kullanıcı bağlandı:', socket.id);

        let clickCount = 0;

        socket.on('buttonClicked', () => {
            clickCount += 1;
            console.log(`🖱️ Buton ${clickCount}. kez tıklandı (Socket ID: ${socket.id})`);
            socket.emit('buttonResponse', `Buton ${clickCount}. kez tıklandı`);
        });

        socket.on('disconnect', () => {
            console.log('❌ Kullanıcı ayrıldı:', socket.id);
        });
    });
};
