import { Controller, event, iif } from 'ringa';

import RESTController from './RESTController';

import {getCookie, setCookie} from '../global/cookie';

export default class APIController extends Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(appModel) {
    super('APIController');

    this.appModel = appModel;

    //---------------------------------
    // AuthController.LOGIN
    //---------------------------------
    this.addListener('login', [
      event(RESTController.POST, {
        url: '/auth',
        bodyParam: 'body'
      }),
      ($lastPromiseResult, $detail) => {
        if ($lastPromiseResult && $lastPromiseResult.token) {
          appModel.token = $lastPromiseResult.token;
          setCookie('smg_auth_token', appModel.token);
          $detail.success = true;
          this.dispatch(APIController.ME);
        } else {
          $detail.success = false;
        }
      }]);

    this.addListener('createUser', [
      event(RESTController.POST, {
        url: '/users',
        bodyParam: 'body'
      }),
      ($lastPromiseResult, $detail) => {
        if ($lastPromiseResult && $lastPromiseResult.token) {
          appModel.token = $lastPromiseResult.token;
          setCookie('smg_auth_token', appModel.token);
          $detail.success = true;
          this.dispatch(APIController.ME);
        } else {
          $detail.success = false;
        }
      }]);

    this.addListener('logout', [
      () => {
        appModel.token = appModel.user = undefined;
        setCookie('smg_auth_token', undefined);
      }]);

    this.addListener('me', [
      event(RESTController.GET, {
        url: '/users/me',
        credentials: true
      }),
      ($lastPromiseResult, $detail) => {
        $detail.success = true;
        appModel.user = $lastPromiseResult;
      }]);

    this.addListener('saveGame', [
      iif(body => !body.id, event(RESTController.POST, {
        url: '/games',
        bodyParam: 'body',
        credentials: true
      }), event(RESTController.PUT, {
        url: '/games',
        bodyParam: 'body',
        credentials: true
      })),
      ($lastPromiseResult, $detail) => {
        if ($lastPromiseResult.game) {
          $detail.success = true;
        } else {
          $detail.success = false;
        }
      }]);

    this.addListener('getGames', [
      event(RESTController.GET, {
        url: '/games',
        credentials: true
      }),
      ($lastPromiseResult) => {
        if ($lastPromiseResult.rows) {
          appModel.games = $lastPromiseResult.rows;
        }
      }]);

    this.addListener('deleteGame', [
      event(RESTController.DELETE, id => ({
        url: `/games/${id}`,
        credentials: true
      })),
      ($lastPromiseResult) => {
        console.log($lastPromiseResult);
      }]);
  }

  busMounted(bus) {
    let token = getCookie('smg_auth_token', this.appModel.token);

    if (token) {
      this.appModel.token = token;

      this.dispatch(APIController.ME);
    }
  }
}
