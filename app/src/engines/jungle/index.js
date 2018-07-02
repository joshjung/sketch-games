import JungleGameCanvas from "./GameCanvas";
import JungleGameContainer from "./GameContainer";

export default {
  id: 'jungle',
  EngineCanvasComponent: JungleGameCanvas,
  initialize: (game) => {
    game.gameContainer = new JungleGameContainer(game);
  },
  destroy: (game) => {
    // TODO actually destroy shit
  },
  title: 'Jungle',
  description: 'The lightweight, barebones game engine for the beginner or those wanting to learn.',
  url: undefined,
  lib: []
}
