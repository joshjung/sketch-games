import PhaserGameCanvas from "./GameCanvas";

export default {
  id: 'phaser-ce',
  EngineCanvasComponent: PhaserGameCanvas,
  initialize: (game) => {},
  destroy: (game) => {
    game.notify('destroy');
  },
  title: 'Phaser CE',
  version: '2.11.0',
  description: 'Complete access to everything in the open-source Phaser CE (community edition) game engine.',
  url: 'https://phaser.io/',
  lib: ['pixi.js', 'p2', 'phaser-ce'],
  load: () => {
    return import('phaser-ce');
  }
}
