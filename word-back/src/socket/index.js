import jwt from 'jsonwebtoken';

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('🔌 Bir kullanıcı bağlandı:', socket.id);

        let username = null;
        let room = null;

        // Kullanıcıyı kimlik doğrulama ve bir odaya yerleştirme
        socket.on('authenticate', ({ token, roomId }) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                username = decoded.username; // Token'da username varsa
                room = roomId; // Kullanıcıdan gelen roomId
                socket.join(room); // Kullanıcıyı odaya dahil et
                console.log(`✅ Kullanıcı doğrulandı: ${username}, Oda: ${room}`);
                io.to(room).emit('systemMessage', `${username} odaya katıldı`);
            } catch (err) {
                console.log('❌ Token doğrulama başarısız');
                socket.emit('unauthorized');
                socket.disconnect();
            }
        });

        // Buton tıklama olayı
        socket.on('buttonClicked', () => {
            if (!username || !room) {
                console.log('❗ Önce kimlik doğrulaması yapılmalı ve bir odaya katılmalısınız!');
                return;
            }

            const msg = `${username} butona bastı`;
            console.log('🖱️', msg);
            io.to(room).emit('buttonResponse', msg);
        });

        // Kullanıcı ayrıldığında
        socket.on('disconnect', () => {
            if (room) {
                io.to(room).emit('systemMessage', `${username} odadan ayrıldı`);
            }
            console.log('❌ Kullanıcı ayrıldı:', socket.id);
        });
    });
};