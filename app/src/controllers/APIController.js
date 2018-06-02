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
        } else if ($lastPromiseResult.message) {
          $detail.success = false;
        }
      }]);

    this.addListener('resetPassword', [
      event(RESTController.POST, {
        url: '/password-reset',
        bodyParam: 'body'
      }),
      ($lastPromiseResult, $detail) => {
        if ($lastPromiseResult && $lastPromiseResult.error) {
          $detail.error = $lastPromiseResult.error;
          $detail.success = false;
        } else {
          $detail.success = true;
        }
      }]);

    this.addListener('resetPasswordValidate', [
      event(RESTController.PUT, $detail => ({
        url: `/password-reset/${$detail.token}`,
        bodyParam: 'body'
      })),
      ($lastPromiseResult, $detail) => {
        if ($lastPromiseResult && $lastPromiseResult.error) {
          $detail.error = $lastPromiseResult.error;
          $detail.success = false;
        } else {
          $detail.success = true;
        }
      }]);

    this.addListener('resetPasswordTokenValidate', [
      event(RESTController.GET, $detail => ({
        url: `/password-reset/${$detail.token}`
      })),
      ($lastPromiseResult, $detail) => {
        if ($lastPromiseResult && $lastPromiseResult.error) {
          $detail.error = $lastPromiseResult.error;
          $detail.success = false;
        } else {
          $detail.success = true;
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
          $detail.error = $lastPromiseResult.message;
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

    this.addListener('cloneGame', [
      event(RESTController.POST, id => ({
        url: '/games/clone',
        bodyParam: 'body',
        body: {
          id,
          userId: this.appModel.user.id
        },
        credentials: true
      })),
      ($lastPromiseResult, $detail) => {
        $detail.success = !!$lastPromiseResult.game;
      }]);

    this.addListener('recordPlay', [
      event(RESTController.POST, id => ({
        url: '/games/play',
        bodyParam: 'body',
        body: {
          id,
          userId: this.appModel.user && this.appModel.user.id
        },
        credentials: true
      })),
      ($lastPromiseResult, $detail) => {
        $detail.success = $lastPromiseResult.success;
      }]);

    this.addListener('recordHighscore', [
      event(RESTController.POST, (id, score, time) => ({
        url: '/games/highscore',
        bodyParam: 'body',
        body: {
          id,
          score,
          time,
          userId: this.appModel.user && this.appModel.user.id,
          name: (this.appModel.user && this.appModel.user.name) || 'Anonymous'
        },
        credentials: true
      })),
      ($lastPromiseResult, $detail) => {
        $detail.success = $lastPromiseResult.success;
      }]);

    this.addListener('clearHighscores', [
      event(RESTController.POST, (id) => ({
        url: '/games/clearHighscores',
        bodyParam: 'body',
        body: {
          id,
          userId: this.appModel.user.id
        },
        credentials: true
      })),
      ($lastPromiseResult, $detail) => {
        $detail.success = $lastPromiseResult.success;
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
