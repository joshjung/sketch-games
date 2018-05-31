import { success, notFound } from '../../services/response/'
import { Game } from '.'
import { sign } from '../../services/jwt'

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
    .then(game => game ? game.view() : null)
    .then(success(res))
    .catch(next);

export const showMe = ({ game }, res) =>
  res.json(game.view(true))

export const create = ({ bodymen: { body } }, res, next) =>
  Game.create(body)
    .then(game => {
      sign(game.id)
        .then((token) => {
          return game.view(true).then(game => ({token, game}));
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
      return game.highscore(body.userId, body.score, body.time, body.name)
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
    .then((game) => game ? Object.assign(game, body).save() : null)
    .then((game) => game ? game.view(true) : null)
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Game.findById(params.id)
    .then(notFound(res))
    .then((game) => game ? game.remove() : null)
    .then(success(res, 204))
    .catch(next);
