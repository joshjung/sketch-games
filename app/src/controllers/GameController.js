import {Controller} from 'ringa';

import GameContainer from '../components/game/GameContainer';

export default class GameController extends Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor() {
    super('GameController');

    this.addListener('setLoopFn', (gameLoopFn, $detail) => {
      $detail.success = this.gameModel.setGameFunctionFromString(gameLoopFn);
    });
  }

  busMounted(bus) {
    console.log('Game controller has been mounted', bus);
  }

  //-----------------------------------
  // Statics
  //-----------------------------------
  static fromGameModel(gameModel) {
    const controller = new GameController();

    controller.gameModel = controller.addModel(gameModel);

    gameModel.gameContainer = new GameContainer(controller);

    return controller;
  }
}
