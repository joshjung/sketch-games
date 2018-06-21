import {Controller} from 'ringa';

import AppModel from '../models/AppModel';
import GameModel from '../models/GameModel';
import RESTController from '../controllers/RESTController';
import GameController from '../controllers/GameController';

import {event} from 'ringa';

import history from '../global/history';
import APIController from "./APIController";

export default class AppController extends Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor() {
    super('AppController');

    this.appModel = this.addModel(new AppModel());

    this.addListener('editGame', id => {
      this.appModel.curGame = this.appModel.curGameController = undefined;
      history.push(`/games/playground/${id}`);
    });

    this.addListener('playGame', id => {
      this.appModel.curGame = this.appModel.curGameController = undefined;
      history.push(`/games/play/${id}`);
    });

    this.addListener('getGameAndSetCurrent', [
      () => {
        this.appModel.curGame = undefined;
        this.appModel.curGameController = undefined;
      },
      event(RESTController.GET, id => ({
        url: `/games/${id}/assets,history`,
        credentials: true
      })),
      ($lastPromiseResult) => {
        if ($lastPromiseResult.id) {
          this.appModel.curGame = new GameModel($lastPromiseResult);

          return this.appModel.curGame.initialize();
        }
      },
      ($lastPromiseResult, playgroundComponent, $detail) => {
        if ($detail.mode === 'published' && this.appModel.curGame.published) {
          this.appModel.curGame.mode = 'published';
        } else {
          this.appModel.curGame.mode = 'development';
        }

        return this.appModel.curGame.reset();
      }, (playgroundComponent) => {
        this.appModel.curGameController = GameController.fromGameModel(this.appModel.curGame);

        playgroundComponent.attach(this.appModel.curGameController);
      }]);
  }
}
