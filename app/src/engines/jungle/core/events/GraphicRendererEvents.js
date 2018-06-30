'use strict';

/*============================================*\
 * Imports
 \*============================================*/
import Event from './../util/Event';

/*============================================*\
 * Constants
 \*============================================*/
export default Event.generateEventList([
  {type: 'WINDOW_SCROLL', description: 'Dispatched when the window scrolls.'},
  {type: 'WINDOW_RESIZE', description: 'Dispatched when the window is resized.'},
  {type: 'CANVAS_RESIZE', description: 'Dispatched when the canvas is resized.'}
]);
