import jwt from 'jsonwebtoken';

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('🔌 Bir kullanıcı bağlandı:', socket.id);

        let clickCount = 0;
        let username = null;

        // Front-end'den token ile gelmesini bekliyoruz
        socket.on('authenticate', (token) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                username = decoded.username; // Token'da username varsa
                console.log(`✅ Kullanıcı doğrulandı: ${email}`);
            } catch (err) {
                console.log('❌ Token doğrulama başarısız');
                socket.emit('unauthorized');
                socket.disconnect();
            }
        });

        socket.on('buttonClicked', () => {
            if (!username) {
                console.log('❗ Önce kimlik doğrulaması yapılmalı!');
                return;
            }

            clickCount += 1;
            const msg = `${username} ${clickCount}. kez butona bastı`;
            console.log('🖱️', msg);
            socket.emit('buttonResponse', msg);
        });

        socket.on('disconnect', () => {
            console.log('❌ Kullanıcı ayrıldı:', socket.id);
        });
    });
};
