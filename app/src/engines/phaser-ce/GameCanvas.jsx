import React from 'react';

import GameCanvasBase from '../shared/GameCanvasBase';

let Phaser;

import {buildAndCallGameLoop} from '../shared/api/gameLoopCaller';

export default class GameCanvas extends GameCanvasBase {
  renderCanvas() {
    return <div id="phaser-container" />;
  }

  setupPhaser() {
    const {game} = this.props;

    Phaser = game._libs.Phaser;

    const self = this;

    let line;

    const config = {
      create: function() {
        self.phaserGame.stage.backgroundColor = 0x124184;

        line = new Phaser.Line(100, 100, 200, 200);
      },
      update: function () {
        line.centerOn(self.phaserGame.input.activePointer.x, self.phaserGame.input.activePointer.y);
        line.rotate(0.05);
      },
      render: function() {
        // Our update loop!

        self.phaserGame.debug.geom(line);
        self.phaserGame.debug.lineInfo(line, 32, 32);

        // buildAndCallGameLoop({
        //   game: self.game,
        //   elapsed: self.phaserGame.time.physicsElapsed,
        //   ctx: this.renderer.ctx
        // });
      }
    };

    this.phaserGame = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-container', config);
  }

  gameChangeHandler(game) {
    super.gameChangeHandler(game);

    game.watch(signal => {
      if (signal === 'libsLoaded') {
        this.setupPhaser();
      }
    })
  }
}
