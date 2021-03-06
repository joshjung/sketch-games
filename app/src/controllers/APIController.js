import { Controller, event, iif } from 'ringa';

import RESTController from './RESTController';

import {getCookie, setCookie} from '../util/cookie';

export default class APIController extends Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(gamePenModel) {
    super('APIController');

    this.gamePenModel = gamePenModel;

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
          gamePenModel.token = $lastPromiseResult.token;
          setCookie('smg_auth_token', gamePenModel.token);
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
          gamePenModel.token = $lastPromiseResult.token;
          setCookie('smg_auth_token', gamePenModel.token);
          $detail.success = true;
          this.dispatch(APIController.ME);
        } else {
          $detail.success = false;
          $detail.error = $lastPromiseResult.message;
        }
      }]);

    this.addListener('logout', [
      () => {
        gamePenModel.token = gamePenModel.user = undefined;
        setCookie('smg_auth_token', undefined);
      }]);

    this.addListener('me', [
      event(RESTController.GET, {
        url: '/users/me',
        credentials: true
      }),
      ($lastPromiseResult, $detail) => {
        $detail.success = true;
        gamePenModel.user = $lastPromiseResult;
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
        $detail.success = !!$lastPromiseResult.game;
      }]);

    this.addListener('cloneGame', [
      event(RESTController.POST, id => ({
        url: '/games/clone',
        bodyParam: 'body',
        body: {
          id,
          userId: this.gamePenModel.user.id
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
          userId: this.gamePenModel.user && this.gamePenModel.user.id
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
          screenshot: this.gamePenModel.curGame.screenshot(),
          userId: this.gamePenModel.user && this.gamePenModel.user.id,
          name: (this.gamePenModel.user && this.gamePenModel.user.name) || 'Anonymous'
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
          userId: this.gamePenModel.user.id
        },
        credentials: true
      })),
      ($lastPromiseResult, $detail) => {
        $detail.success = $lastPromiseResult.success;
      }]);

    this.addListener('viewHighscore', [
      event(RESTController.GET, (id, userId, timestamp) => ({
        url: `/games/highscore/${id}/${userId}/${timestamp}`
      })),
      ($lastPromiseResult) => {
        console.log($lastPromiseResult);
      }]);

    this.addListener('getGames', [
      event(RESTController.GET, {
        url: '/games',
        credentials: true
      }),
      ($lastPromiseResult) => {
        if ($lastPromiseResult.rows) {
          gamePenModel.games = $lastPromiseResult.rows;
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

    this.addListener('addAsset', [
      event(RESTController.POST, (gameId, assetId, description, file, type, groupId) => ({
        url: `/games/${gameId}/asset`,
        credentials: true,
        bodyParam: 'body',
        contentType: 'multipart/form-data',
        body: {
          assetId,
          description,
          file,
          type,
          groupId
        }
      })),
      ($lastPromiseResult) => {
        console.log($lastPromiseResult);
      }]);

    this.addListener('deleteAsset', [
      event(RESTController.DELETE, (gameId, assetId) => ({
        url: `/games/${gameId}/asset/${assetId}`,
        credentials: true
      })),
      ($lastPromiseResult) => {
        console.log($lastPromiseResult);
      }]);
  }

  busMounted(bus) {
    let token = getCookie('smg_auth_token', this.gamePenModel.token);

    if (token) {
      this.gamePenModel.token = token;

      this.dispatch(APIController.ME);
    }
  }
}
