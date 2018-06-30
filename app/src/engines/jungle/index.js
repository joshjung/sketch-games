import JungleGameCanvas from "./GameCanvas";
import JungleGameContainer from "./GameContainer";

export default {
  EngineCanvasComponent: JungleGameCanvas,
  initialize: (game) => {
    game.gameContainer = new JungleGameContainer(game);
  }
}