// src/socket/gameHandler.js
export const startGame = (roomId, players, gameType, io) => {
    let currentTurnIndex = 0;
    const gameDuration = gameType === '2dk' ? 120000 : gameType === '5dk' ? 300000 : 1200000; // 2dk, 5dk veya 20dk

    // Oyunculara başlama sırası ve zamanlayıcı
    const playersWithTimer = players.map(player => ({
        ...player,
        timeRemaining: gameDuration,
        turnGiven: false,
        score: 0,
        wordCount: 0, // Kelime sayısını başlatıyoruz
    }));

    io.to(roomId).emit('game_start', {
        roomId,
        players: playersWithTimer,
        turn: playersWithTimer[currentTurnIndex].id,
        gameType,
    });

    // Zamanlayıcı başlat
    const gameTimer = setInterval(() => {
        // Her 1 saniyede bir zamanı güncelle
        playersWithTimer.forEach(player => {
            if (!player.turnGiven && player.timeRemaining > 0) {
                player.timeRemaining -= 1000;
            }
        });

        // Zamanı biten oyuncuyu kontrol et
        playersWithTimer.forEach(player => {
            if (player.timeRemaining <= 0 && !player.turnGiven) {
                // Zamanı biten oyuncu hükmen kaybeder
                player.score = 100; // Hükmen kaybeden oyuncuya 100 puan veriyoruz
                io.to(roomId).emit('game_end', {
                    winner: getWinner(playersWithTimer),
                    loser: player,
                    message: `Zaman doldu! ${player.username} kaybetti.`,
                });
                clearInterval(gameTimer);
            }
        });

        // Eğer oyuncular 50 kelimeye ulaşmışsa, oyun biter
        const totalWords = playersWithTimer.reduce((acc, player) => acc + player.wordCount, 0);
        if (totalWords >= 50) {
            clearInterval(gameTimer);
            io.to(roomId).emit('game_end', {
                winner: getWinner(playersWithTimer),
                message: '50 kelimeye ulaşıldı, oyun sona erdi.',
            });
        }

    }, 1000);

    // Oyuncuların kelimelerini girmelerini bekleyelim
    io.on('word_submission', (playerId, word) => {
        const currentPlayer = playersWithTimer.find(p => p.id === playerId);
        if (currentPlayer && currentPlayer.timeRemaining > 0 && !currentPlayer.turnGiven) {
            currentPlayer.turnGiven = true;
            const score = calculateScore(word);
            currentPlayer.score += score;
            currentPlayer.wordCount += 1; // Kelime sayısını arttırıyoruz
            io.to(roomId).emit('word_submitted', { playerId, word, score });

            // Sonraki oyuncuya geçiş
            currentTurnIndex = (currentTurnIndex + 1) % playersWithTimer.length;
            const nextPlayer = playersWithTimer[currentTurnIndex];
            io.to(roomId).emit('turn_change', {
                turn: nextPlayer.id,
                timeRemaining: nextPlayer.timeRemaining,
            });

            nextPlayer.turnGiven = false;
        }
    });
};

// Kazananı belirlemek için
const getWinner = (players) => {
    return players.reduce((a, b) => (a.score > b.score ? a : b));
};

const calculateScore = (word) => {
    // Burada kelimenin uzunluğuna göre bir puan hesaplanabilir
    return word.length;
};
