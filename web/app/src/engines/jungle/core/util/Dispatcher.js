'use strict';

/*============================================*\
 * Class
\*============================================*/
/**
 * An event dispatcher.
 */
class Dispatcher {
  //---------------------------------------------
  // Constructor
  //---------------------------------------------
  /**
   * Builds an empty dispatcher.
   */
  constructor() {
    this.listeners = {};
  }

  //---------------------------------------------
  // Methods
  //---------------------------------------------
  /**
   * Add a listener for a particular event type. Remember to bind the function if you want to preserve `this`.
   *
   * @param {String} type The type of the event to listen for.
   * @param {Function} callback The function to call when the event is dispatched.
   */
  addListener(type, callback) {
    if (!type) {
      throw new Error('Expected a type object to be provided to Dispatcher.');
    } else if (!type.type) {
      throw new Error('Expected the provided type object to have a type property when provided to Dispatcher.');
    } else if (!this.listeners) {
      throw new Error('Dispatcher constructor was not called before calling addListener.');
    }
    this.listeners[type.type] = this.listeners[type.type] || [];
    this.listeners[type.type].push(callback);
  }

  /**
   * Dispatch an Event.
   *
   * @param {Event} event
   */
  dispatch(event) {
    if (!this.listeners) {
      throw new Error('Please call Dispatcher constructor.');
    }
    this.listeners[event.type.type] ? this.listeners[event.type.type].forEach(l => l(event)) : void 0;
  }

  /**
   * Returns true if this Dispatcher has at least one listener for the requested event.
   *
   * @param {String} type
   * @returns {Boolean}
   */
  hasListener(type) {
    return this.listeners[type.type] !== undefined;
  }
}

export default Dispatcher;
