'use strict';

/*============================================*\
 * Imports
\*============================================*/
import Dispatcher from './Dispatcher';

/*============================================*\
 * Class
\*============================================*/
/**
 * A DispatcherNode is a Dispatcher class that can have children and a parent so that
 * a tree of event listeners and dispatchers can be built. This allows for a bubble
 * and capture phase.
 */
class DispatcherNode extends Dispatcher {
  //---------------------------------------------
  // Constructor
  //---------------------------------------------
  /**
   * Create a new DispatcherNode
   */
  constructor() {
    super();

    this.captureListeners = [];
    this._dispatchChildren = [];
    this._parent = null;
  }

  //---------------------------------------------
  // Properties
  //---------------------------------------------
  /**
   * Set the parent dispatcher node.
   *
   * @param {DispatcherNode} parent
   */
  set parentDispatchNode(parent) {
    this._parent = parent;
  }

  /**
   * Get the parent DispatcherNode.
   *
   * @returns {null|DispatcherNode|*}
   */
  get parentDispatchNode() {
    return this._parent;
  }

  /**
   * Returns the array of all dispatcher children.
   *
   * @returns {Array}
   */
  get dispatchChildren() {
    return this._dispatchChildren;
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
  addListener(type, callback, useCapture) {
    var la = useCapture ? this.captureListeners : this.listeners;
    la[type.type] = la[type.type] || [];
    la[type.type].push(callback);
  }

  /**
   * Dispatch an Event properly managing bubbling, capture, and flood phases.
   *
   * @param {Event} event
   */
  dispatch(event) {
    event.target = this;
    if (event.useCapture) {
      event.phase = 1;
      this.getAncestors().forEach(a => {
        if (a.hasCaptureListener(event.type.type)) {
          event.currentTarget = a;
          a._dispatch(event);
        }
      });
    }

    event.phase = 0;
    this._dispatch(event);

    if (event.flood) {
      this._dispatchChildren.forEach(c => {
        c.dispatch(event);
      });
    }

    if (event.bubbles) {
      event.phase = 2;
      this.getAncestors().reverse().forEach(a => {
        event.currentTarget = a;
        a._dispatch(event);
      });
    }
  }

  /**
   * Internal dispatch method.
   *
   * @param {Event} event
   * @param {Boolean} useCapture
   * @private
   */
  _dispatch(event, useCapture) {
    if (useCapture) {
      this.captureListeners[event.type.type] ? this.captureListeners[event.type.type].forEach(l => l(event)) : void 0;
      return;
    }
    this.listeners[event.type.type] ? this.listeners[event.type.type].forEach(l => l(event)) : void 0;
  }

  /**
   * Adds a Dispatcher as a child.
   *
   * @param {Dispatcher} child
   */
  addDispatchChild(child) {
    this.addDispatchChildAt(this._dispatchChildren.length);
  }

  /**
   * Adds a Dispatcher at the specified index.
   *
   * @param {Dispatcher} child
   * @param {Number} index
   */
  addDispatchChildAt(child, index) {
    this._dispatchChildren.splice(index, 0, child);
  }

  /**
   * Removes the provided dispatch child.
   *
   * @param {Dispatcher} child
   */
  removeDispatchChild(child) {
    this.removeDispatchChildAt(this.dispatchChildren.indexOf(child));
  }

  /**
   * Removes a child at the specified index.
   *
   * @param {Dispatcher} index
   */
  removeDispatchChildAt(index) {
    this.dispatchChildren.splice(index, 1);
  }

  /**
   * Returns an Array of all the ancestors, with the root being at index 0.
   *
   * If there are no ancestors, returns undefined.
   *
   * @returns {Array|undefined}
   */
  getAncestors() {
    var r = this.parent ? [this.parent] : undefined;
    if (r) {
      while (r[0].parent) {
        r.unshift(r[0].parent);
      }
    }
    return r;
  }
}

export default DispatcherNode;
