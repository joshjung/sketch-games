'use strict';
/*============================================*\
 * Imports
\*============================================*/
import DispatcherNode from './util/DispatcherNode';

/*============================================*\
 * Class
\*============================================*/
class Graphic extends DispatcherNode {
  //---------------------------------------------
  // Constructor
  //---------------------------------------------
  constructor() {
    super();
  }

  //---------------------------------------------
  // Methods
  //---------------------------------------------

  //---------------------------------------------
  // Event Handlers
  //---------------------------------------------
  /**
   * Designed to be overridden by sub-class.
   *
   * @param {Number} elapsed Number of seconds that have elapsed since last render.
   */
  onFrameHandler(elapsed) {
    // noop
  }
}

export default Graphic;
