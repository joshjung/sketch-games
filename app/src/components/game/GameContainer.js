import GraphicContainer from '../../core/GraphicContainer';

export default class GameContainer extends GraphicContainer {
  constructor(gameController, options, id) {
    super(options, id);

    this.gameModel = gameController.gameModel;
    this.gameController = gameController;
  }

  onFrameHandler(elapsed) {
    if (this.gameModel.gameLoopFn) {
      try {
        this.gameModel.gameLoopFn(elapsed, this.gameModel.gameContainer.renderer.ctx, this.gameModel, this.gameController);
      } catch (error) {
        this.gameModel.runError = error.toString();
      }
    }
  }
}