import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token, master } from '../../services/passport'
import { index, showMe, show, create, update, updatePassword, destroy } from './controller'
import { schema } from './model'
export Game, { schema } from './model'

const router = new Router()
const { title, gameLoopFnText } = schema.tree

/**
 * @api {get} /games Retrieve games
 * @apiName RetrieveGames
 * @apiGroup Game
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiUse listParams
 * @apiSuccess {Object[]} games List of games.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /games/:id Retrieve game
 * @apiName RetrieveUser
 * @apiGroup User
 * @apiPermission public
 * @apiSuccess {Object} game User's data.
 * @apiError 404 User not found.
 */
router.get('/:id',
  show)

/**
 * @api {post} /games Create game
 * @apiName CreateUser
 * @apiGroup User
 * @apiPermission master
 * @apiParam {String} access_token Master access_token.
 * @apiParam {String} email User's email.
 * @apiParam {String{6..}} password User's password.
 * @apiParam {String} [name] User's name.
 * @apiParam {String} [picture] User's picture.
 * @apiParam {String=game,admin} [role=game] User's role.
 * @apiSuccess (Sucess 201) {Object} game User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Master access only.
 * @apiError 409 Email already registered.
 */
router.post('/',
  token({ required: true }),
  body({ title, gameLoopFnText }),
  create)

/**
 * @api {put} /games/:id Update game
 * @apiName UpdateUser
 * @apiGroup User
 * @apiPermission game
 * @apiParam {String} access_token User access_token.
 * @apiParam {String} [name] User's name.
 * @apiParam {String} [picture] User's picture.
 * @apiSuccess {Object} game User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current game or admin access only.
 * @apiError 404 User not found.
 */
router.put('/:id',
  token({ required: true }),
  body({ title, gameLoopFnText }),
  update)

/**
 * @api {delete} /games/:id Delete game
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 Admin access only.
 * @apiError 404 User not found.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
