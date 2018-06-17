import { success, notFound } from '../../services/response/'
import { Game } from '.'
import { sign } from '../../services/jwt'
import fileForm from '../fileForm';
import streamToBuf from 'stream-to-buf';

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Game.count(query)
    .then(count => Game.find(query, select, cursor)
      .then(games => {
        return Promise.all(games.map(game => game.view())).then(rows => {
          return {
            rows,
            count
          };
        });
      })
    )
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Game.findById(params.id)
    .then(notFound(res))
    .then(game => game ? game.view(params.addFields) : null)
    .then(success(res))
    .catch(next);

export const create = ({ bodymen: { body } }, res, next) =>
  Game.create(body)
    .then(game => {
      sign(game.id)
        .then((token) => {
          return game.view('history,createdAt').then(game => ({token, game}));
        })
        .then(success(res, 201))
        .catch(next);
    })
    .catch(next);

export const clone = ({ bodymen: { body } }, res, next) =>
  Game.findById(body.id)
    .then(notFound(res))
    .then(game => {
      return game.clone(body.userId)
                 .then(success(res, 201))
                 .catch(next);
    })
    .catch(next);

export const play = ({ bodymen: { body } }, res, next) =>
  Game.findById(body.id)
    .then(notFound(res))
    .then(game => {
      return game.play(body.userId)
        .then(success(res, 201))
        .catch(next);
    })
    .catch(next);

export const highscore = ({ bodymen: { body } }, res, next) =>
  Game.findById(body.id)
    .then(notFound(res))
    .then(game => {
      return game.highscore(body.userId, body.score, body.time, body.name, body.screenshot)
        .then(success(res, 201))
        .catch(next);
    })
    .catch(next);

export const viewHighscore = ({ params }, res, next) =>
  Game.findById(params.gameId)
    .then(notFound(res))
    .then(game => {
      return game.viewHighscore(params.userId, params.timestamp)
        .then(success(res, 201))
        .catch(next);
    })
    .catch(next);

export const clearHighscores = ({ bodymen: { body } }, res, next) =>
  Game.findById(body.id)
    .then(notFound(res))
    .then(game => {
      return game.clearHighscores(body.userId)
        .then(success(res, 201))
        .catch(next);
    })
    .catch(next);

export const update = ({ bodymen: { body }, params, game }, res, next) =>
  Game.findById(params.id === 'me' ? game.id : params.id)
    .then(notFound(res))
    .then((game) => game ? game.saveWithHistory(body) : null)
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Game.findById(params.id)
    .then(notFound(res))
    .then((game) => game ? game.remove() : null)
    .then(success(res, 204))
    .catch(next);

export const addAsset = (req, res, next) =>
  Game.findById(req.params.gameId)
    .then(notFound(res))
    .then(game => {
      if (!game) return null;

      return fileForm(req, res, next).then(multiparty => {
        console.log('Parsing file', multiparty.files[0].filename);

        const {assetId, description,type,groupId} = multiparty.fields;

        return game.addAsset(assetId,
          description,
          multiparty.files[0].buffer,
          type,
          multiparty.files[0].contentType,
          groupId);
      });
    })
    .then(success(res, 201))
    .catch(next);

export const deleteAsset = (req, res, next) =>
  Game.findById(req.params.gameId)
    .then(notFound(res))
    .then(game => {
      if (!game) return null;

      return game.deleteAsset(req.params.assetId);
    })
    .then(success(res, 201))
    .catch(next);
