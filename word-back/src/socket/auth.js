import jwt from 'jsonwebtoken';

export const handleAuth = (socket, onAuthSuccess) => {
    socket.on('authenticate', ({ token }) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const username = decoded.username;
            onAuthSuccess(username);
            console.log(`✅ User authenticated: ${username}`);
        } catch (err) {
            console.log('❌ Token verification failed');
            socket.emit('unauthorized');
            socket.disconnect();
        }
    });
};
