// src/socket/gameHandler.js
export const startGame = (roomId, players, gameType, io) => {
    let currentTurnIndex = 0;
    const gameDuration = gameType === '5dk' ? 300000 : 1200000; // 5dk veya 20dk

    // Oyunculara başlama sırası ve zamanlayıcı
    const playersWithTimer = players.map(player => ({
        ...player,
        timeRemaining: gameDuration, // Oyuncuya kalan süreyi başlatıyoruz
        turnGiven: false,
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
            if (player.turnGiven && player.timeRemaining > 0) {
                player.timeRemaining -= 1000; // 1 saniye azalma
            }
        });

        // Zaman biten oyuncuyu kontrol et
        playersWithTimer.forEach(player => {
            if (player.timeRemaining <= 0) {
                // Zamanı biten oyuncu hükmen kaybeder
                io.to(roomId).emit('game_end', {
                    winner: getWinner(playersWithTimer),
                    loser: player,
                    message: `Zaman doldu! ${player.username} kaybetti.`,
                });
                clearInterval(gameTimer);
            }
        });

    }, 1000);

    // Oyuncuların kelimelerini girmelerini bekleyelim
    io.on('word_submission', (playerId, word) => {
        const currentPlayer = playersWithTimer.find(p => p.id === playerId);
        if (currentPlayer && currentPlayer.timeRemaining > 0 && !currentPlayer.turnGiven) {
            currentPlayer.turnGiven = true;
            // Burada kelime doğrulama yapılabilir
            const score = calculateScore(word); // Kelimenin puanı
            currentPlayer.score = (currentPlayer.score || 0) + score;
            io.to(roomId).emit('word_submitted', { playerId, word, score });

            // Sonraki oyuncuya geçiş
            currentTurnIndex = (currentTurnIndex + 1) % playersWithTimer.length;
            const nextPlayer = playersWithTimer[currentTurnIndex];
            io.to(roomId).emit('turn_change', {
                turn: nextPlayer.id,
                timeRemaining: nextPlayer.timeRemaining,
            });

            // Zamanlayıcıyı sıfırlıyoruz
            nextPlayer.turnGiven = false;
        }
    });
};

const calculateScore = (word) => {
    // Burada basit bir kelime skoru hesaplama yapılabilir, örneğin:
    return word.length; // Örnek olarak kelime uzunluğunu puan olarak alıyoruz
};

const getWinner = (players) => {
    // Puanı en yüksek olan oyuncu kazanan olur
    return players.reduce((a, b) => (a.score > b.score ? a : b));
};
