// src/socket/queues.js
export const gameQueues = {
    '2dk': [],
    '5dk': [],
    '12saat': [],
    '24saat': [],
};

export const addToQueue = (gameType, socket) => {
    if (!gameQueues[gameType]) gameQueues[gameType] = [];
    gameQueues[gameType].push(socket);
};

export const removeFromQueue = (gameType, socketId) => {
    gameQueues[gameType] = gameQueues[gameType].filter((s) => s.id !== socketId);
};

export const tryMatchPlayers = (gameType, io) => {
    const queue = gameQueues[gameType];
    if (queue.length >= 2) {
        const player1 = queue.shift();
        const player2 = queue.shift();

        const roomId = `game_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        player1.join(roomId);
        player2.join(roomId);

        const players = [
            { id: player1.user.id, socketId: player1.id },
            { id: player2.user.id, socketId: player2.id },
        ];

        // Rastgele kimin başlayacağını belirle
        const firstTurn = players[Math.floor(Math.random() * 2)].id;

        io.to(roomId).emit('game_start', {
            roomId,
            players,
            turn: firstTurn,
            gameType,
        });

        console.log(`🎮 Oyun başlatıldı: ${roomId}`);
    }
};
