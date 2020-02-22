'use strict';

/*============================================*\
 * Imports
\*============================================*/
import Event from './../util/Event';

/*============================================*\
 * Constants
\*============================================*/
export default Event.generateEventList([
  {type: 'ADDED', description: 'Called on a child Graphic when it is added to a new parent GraphicContainer.'},
  {type: 'CHILD_ADDED', description: 'Called on a parent GraphicContainer when it has a new child added to it.'},
  {type: 'REMOVED', description: 'Called on a child Graphic when it is removed from a parent GraphicContainer.'},
  {type: 'CHILD_REMOVED', description: 'Called on a parent GraphicContainer when a child Graphic has been removed.'}
]);
