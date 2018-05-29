import {Controller} from 'ringa';

import AppModel from '../models/AppModel';
import GameModel from '../models/GameModel';
import RESTController from '../controllers/RESTController';
import GameController from '../controllers/GameController';

import {event} from 'ringa';

export default class AppController extends Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor() {
    super('AppController');

    this.appModel = this.addModel(new AppModel());

    this.addListener('getGameAndSetCurrent', [
      event(RESTController.GET, id => ({
        url: `/games/${id}`,
        credentials: true
      })),
      ($lastPromiseResult, playgroundComponent) => {
        if ($lastPromiseResult.id) {
          this.appModel.curGame = new GameModel($lastPromiseResult);
          this.appModel.curGameController = GameController.fromGameModel(this.appModel.curGame);

          playgroundComponent.attach(this.appModel.curGameController);
        }
      }]);

    this.addListener('createGameAndSetCurrent', [
      (playgroundComponent) => {
        this.appModel.curGame = new GameModel(undefined, {id: ''});
        this.appModel.curGameController = GameController.fromGameModel(this.appModel.curGame);

        playgroundComponent.attach(this.appModel.curGameController);
      }]);
  }
}
