'use strict';

/*============================================*\
 * Imports
 \*============================================*/
import Event from './../util/Event';

/*============================================*\
 * Constants
 \*============================================*/
export default Event.generateEventList([
  {type: 'FOCUS_CHANGE', description: 'Dispatched when the window loses or gains focus.'}
]);
