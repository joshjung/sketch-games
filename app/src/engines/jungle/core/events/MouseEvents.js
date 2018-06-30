'use strict';

/*============================================*\
 * Imports
 \*============================================*/
import Event from '../util/Event';

/*============================================*\
 * Constants
 \*============================================*/
export default Event.generateEventList([
  {type: 'CLICK', description: 'Dispatched on a mouse click.'},
  {type: 'MOUSE_DOWN', description: 'Dispatched on a mouse down.'},
  {type: 'MOUSE_UP', description: 'Dispatched on a mouse up.'},
  {type: 'MOUSE_MOVE', description: 'Dispatched on a mouse move.'},
  {type: 'MOUSE_OUT', description: 'Dispatched on a mouse out.'}
]);
