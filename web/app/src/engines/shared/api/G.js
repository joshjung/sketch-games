import APIController from '../../../controllers/APIController';

export function recordScore(game, score) {
  const isHighscore = !game.highscores ||
    game.highscores.length < 50 ||
    game.highscores.find(hs => hs.score < score);

  if (isHighscore) {
    if (game.mode === 'published') {
      setTimeout(() => {
        game.gameCanvas.dispatch(APIController.RECORD_HIGHSCORE, {
          id: game.id,
          score,
          time: game.timePlayed
        }).then($lastPromiseResult => {
          if ($lastPromiseResult.success) {
            game.highscores = $lastPromiseResult.highscores;
            console.log('new highscores', game.highscores);
          }
        });
      }, 0);
    } else {
      console.log(`You are in development mode, your highscore of ${score} is not recorded.`);
    }

    return true;
  }

  return false;
}

export function restart(game) {
  game.restart();
}