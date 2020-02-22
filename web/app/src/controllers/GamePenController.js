import {Controller} from 'ringa';

import GamePenModel from '../models/GamePenModel';
import GameModel from '../models/GameModel';
import RESTController from '../controllers/RESTController';

import {event} from 'ringa';

import history from '../util/history';

export default class GamePenController extends Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor() {
    super('GamePenController');

    this.gamePenModel = this.addModel(new GamePenModel());

    this.addListener('editGame', id => {
      this.gamePenModel.curGame = this.gamePenModel.curGameController = undefined;
      history.push(`/games/playground/${id}`);
    });

    this.addListener('playGame', id => {
      this.gamePenModel.curGame = this.gamePenModel.curGameController = undefined;
      history.push(`/games/play/${id}`);
    });

    this.addListener('getGameAndSetCurrent', [
      () => {
        this.gamePenModel.curGame = this.gamePenModel.curGameController = undefined;
      },
      event(RESTController.GET, id => ({
        url: `/games/${id}/assets,history`,
        credentials: true
      })),
      ($lastPromiseResult) => {
        if ($lastPromiseResult.id) {
          this.gamePenModel.curGame = new GameModel($lastPromiseResult);

          return this.gamePenModel.curGame.initialize();
        }
      },
      ($lastPromiseResult, playgroundComponent, $detail) => {
        if ($detail.mode === 'published' && this.gamePenModel.curGame.published) {
          this.gamePenModel.curGame.mode = 'published';
        } else {
          this.gamePenModel.curGame.mode = 'development';
        }

        return this.gamePenModel.curGame.reset();
      }, () => {
        this.gamePenModel.curGame.engine.initialize(this.gamePenModel.curGame);

        //playgroundComponent.attach(this.gamePenModel.curGame);
      }]);
  }
}
