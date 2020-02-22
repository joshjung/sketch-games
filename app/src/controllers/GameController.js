import {Controller} from 'ringa';

import GameContainer from '../components/game/GameContainer';

export default class GameController extends Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor() {
    super('GameController');
  }

  //-----------------------------------
  // Statics
  //-----------------------------------
  static fromGameModel(gameModel) {
    const controller = new GameController();

    controller.gameModel = controller.addModel(gameModel);

    gameModel.gameContainer = new GameContainer(controller);
    gameModel.gameController = controller;

    return controller;
  }
}