import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token, master } from '../../services/passport'
import { index, showMe, show, create, clone, update, updatePassword, destroy } from './controller'
import { schema } from './model'
export Game, { schema } from './model'

const router = new Router();
const { title,
  gameLoopFnText,
  ownerUserId,
  instructions,
  description,
  published,
  publishedDate,
  publishedTitle,
  publishedInstructions,
  publishedDescription,
  publishedGameLoopFnText,
  history,
  originalGameId,
  clonedFromGameId } = schema.tree;

router.get('/',
  query(),
  index);

router.get('/:id',
  show);

router.post('/',
  token({ required: true }),
  body({ title,
    description,
    published,
    publishedDate,
    publishedTitle,
    publishedInstructions,
    publishedDescription,
    publishedGameLoopFnText,
    gameLoopFnText,
    ownerUserId,
    instructions,
    originalGameId,
    clonedFromGameId,
    history
  }),
  create);

router.post('/clone',
  token({ required: true }),
  body({ id: {type: String}, userId: {type: String} }),
  clone);

router.put('/:id',
  token({ required: true }),
  body({ title,
    description,
    published,
    publishedDate,
    publishedTitle,
    publishedInstructions,
    publishedDescription,
    publishedGameLoopFnText,
    gameLoopFnText,
    ownerUserId,
    instructions,
    history
  }),
  update);

router.delete('/:id',
  token({ required: true }),
  destroy);

export default router;
