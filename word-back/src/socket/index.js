import jwt from 'jsonwebtoken';

export const socketHandler = (io) => {
    const roomMessages = {}; // Her oda için mesaj geçmişini tutar

    io.on('connection', (socket) => {
        console.log('🔌 Bir kullanıcı bağlandı:', socket.id);

        let username = null;

        // Kullanıcıyı kimlik doğrulama
        socket.on('authenticate', ({ token }) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                username = decoded.username; // Token'da username varsa
                console.log(`✅ Kullanıcı doğrulandı: ${username}`);
            } catch (err) {
                console.log('❌ Token doğrulama başarısız');
                socket.emit('unauthorized');
                socket.disconnect();
            }
        });

        // Odaya katılma
        socket.on('joinRoom', (roomId) => {
            if (!username) {
                console.log('❗ Önce kimlik doğrulaması yapılmalı!');
                return;
            }

            // Kullanıcıyı eski odadan çıkar
            const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
            rooms.forEach((room) => socket.leave(room));

            // Kullanıcıyı yeni odaya ekle
            socket.join(roomId);
            console.log(`✅ ${username} ${roomId} odasına katıldı`);

            // Oda için mesaj geçmişini oluştur (yeni oda ise)
            if (!roomMessages[roomId]) {
                roomMessages[roomId] = [];
            }

            // Oda geçmişini gönder
            socket.emit('roomHistory', roomMessages[roomId]);

            // Odaya katılım mesajını yayınla
            io.to(roomId).emit('systemMessage', `${username} odaya katıldı`);
        });

        // Kelime gönderme olayı
        socket.on('sendWord', ({ roomId, word }) => {
            if (!username || !roomId || !word) {
                console.log('❗ Kullanıcı doğrulanmamış, oda ID veya kelime eksik!');
                return;
            }

            const msg = `[${username}] kelime gönderdi: ${word}`;
            console.log('📝', msg);

            // Mesajı odaya ekle ve yayınla
            roomMessages[roomId].push(msg);
            io.to(roomId).emit('wordResponse', msg);
        });

        // Kullanıcı ayrıldığında
        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
            console.log(`❌ ${username} ${roomId} odasından ayrıldı`);
            io.to(roomId).emit('systemMessage', `${username} odadan ayrıldı`);
        });

        socket.on('disconnect', () => {
            console.log('❌ Kullanıcı ayrıldı:', socket.id);
        });
    });
};