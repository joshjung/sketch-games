'use strict';

/*============================================*\
 * Imports
\*============================================*/
import Document from './Document';
import DocumentEvents from './events/DocumentEvents';
import GraphicComponent from './GraphicComponent';
import GraphicRendererEvents from './events/GraphicRendererEvents';
import MouseEvents from './events/MouseEvents';
import Event from './util/Event';
import Rect from './util/Rect';

/*============================================*\
 * Constants
\*============================================*/
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 800 / 1.618;  // Golden Ratio

/*============================================*\
 * Class
\*============================================*/
/**
 * GraphicRenderer is a Class that manages rendering onto a single canvas. Each canvas
 * should have a single GraphicRenderer.
 *
 * Each GraphicRenderer has one or more components that are stacked on top of each other.
 *
 * The GraphicRenderer is responsible for:
 *
 * - Keeping track of elapsed time
 * - Clearing the canvas
 * - Organizing the components so they draw themselves at the proper times and in
 *   the proper order.
 */
class GraphicRenderer extends GraphicComponent {
  //---------------------------------------------
  // Constructor
  //---------------------------------------------
  /**
   * Build a GraphicRenderer for one canvas.
   *
   * @param {HTMLCanvasElement} canvas The HTMLCanvasElement upon which to render.
   * @param {Object} options The options for this renderer.
   * @param {String} id The id of this renderer.
   */
  constructor(canvas, options, id) {
    if (!canvas) {
      throw 'Please provide a canvas to GraphicRenderer. Thank you and have a nice day.';
    }
    super(options, id);

    this.canvas = canvas;
    this.document = new Document();

    this.document.addListener(DocumentEvents.FOCUS_CHANGE, this._focusChangeHandler.bind(this));

    let o = this.options = options || {};
    o.canvasAutoClear = o.canvasAutoClear !== undefined ? o.canvasAutoClear : true;
    o.resizeToCanvas = o.resizeToCanvas === true ? true : false;

    o.debugPosX = o.debugPosX || 10;
    o.debugPosY = o.debugPosY || 10;

    o.pauseOnLoseFocus = o.pauseOnLoseFocus === false ? false : true;

    this.enabled = o.enabled === false ? false : true;

    this.fps = 0;

    // lastTime is the previous time that the render loop was called
    this.lastTime = 0;

    if (!o.fillWindow) {
      this.canvasTargetWidth = this.width = (o.width || DEFAULT_WIDTH);
      this.canvasTargetHeight = this.height = (o.height || DEFAULT_HEIGHT);
    }

    setTimeout(this._resizeHandler.bind(this), 1);

    window.addEventListener('resize', this._resizeHandler.bind(this));
    this.lastScrollTop = window.pageYOffset;

    window.addEventListener('scroll', this._scrollHandler.bind(this));

    if (o.mouseEnabled !== false) {
      canvas.addEventListener('mousemove', this._canvasOnMouseMoveHandler.bind(this));
      canvas.addEventListener('mouseout', this._canvasOnMouseOutHandler.bind(this));
      canvas.addEventListener('click', this._canvasOnMouseClickHandler.bind(this));
      canvas.addEventListener('mousedown', this._canvasOnMouseDownHandler.bind(this));
      canvas.addEventListener('mouseup', this._canvasOnMouseUpHandler.bind(this));
    }

    if (o.touchEnabled !== false) {
      canvas.addEventListener('touchstart', this._canvasOnTouchStartHandler.bind(this));
      canvas.addEventListener('touchmove', this._canvasOnTouchMoveHandler.bind(this));
    }

    if (id) {
      canvas.setAttribute('id', id);
      window.jd = window.jd || {};
      window.jd[id] = this;
    }

    // GraphicComponent properties
    this.renderer = this;
    this.parent = undefined;

    this._cursor = 'auto';
    this._paused = false;

    this.mouse = {
      canvasX: -1,
      canvasY: -1
    };

    // Set up our render loop
    window.requestAnimationFrame(this._onFrameFirstHandler.bind(this));
  }

  //---------------------------------------------
  // Properties
  //---------------------------------------------
  /**
   * Text to display in the upper-left of the canvas when debug is true.
   *
   * @returns {String} The debug text to display.
   */
  get debugText() {
    let fpsNow = Math.round(1 / this.elapsed);
    this.fps = Math.ceil(this.fps * 0.90 + fpsNow * 0.10);
    return (this.id ? this.id : '[no-id]') + ': ' +
           this.canvas.width + ', ' +
           this.canvas.height + ' FPS: ' +
           this.fps + (this.options.debugText ? this.options.debugText : '') +
           ' ' + this.options.canvasAutoClear;
  }

  /**
   * Formats and then send the args to the console.
   *
   * @param {Object} args The arguments in order to send to the console.
   */
  debug(...args) {
    if (this.options.debug) {
      console.log.apply(console, args);
    }
  }

  /**
   * Returns the currently assigned cursor for when the mouse is over the Renderer.
   *
   * @returns {String|*}
   */
  get bodyCursor() {
    return this._cursor;
  }

  /**
   * Set the cursor of the document body. Will not be actually set until next frame.
   *
   * @param {String} value 'auto', 'pointer', etc. See W3 specification.
   */
  set bodyCursor(value) {
    this._cursor = value;

    this.callNextFrame('setBodyCursor', function() {
      document.body.style.cursor = value;
    });
  }

  /**
   * Returns true if the renderer is paused and the entire window looping mechanism is stalled.
   *
   * @returns {Boolean}
   */
  get paused() {
    return this._paused;
  }

  /**
   * Set to true to stop all window loop management.
   *
   * @param {Boolean} value True or false.
   */
  set paused(value) {
    if (this._paused === value) {
      return;
    }
    this._paused = value;
  }

  //---------------------------------------------
  // Event Handlers
  //---------------------------------------------
  _focusChangeHandler(event) {
    if (this.options.pauseOnLoseFocus) {
      this.paused = !event.properties.focus;
    }
  }

  /**
   * Internal resize handler called when the browser window is resized.
   *
   * @param {Event} event
   */
  _resizeHandler(event) {
    let prevWidth = this.canvas.width;
    let prevHeight = this.canvas.height;

    if (this.options.resizeToCanvas) {
      this.canvas.setAttribute('width', this.canvas.clientWidth);
    } else {
      this.canvas.setAttribute('width', this.canvasTargetWidth);
    }

    let r = parseFloat(this.canvas.clientHeight) / parseFloat(this.canvas.clientWidth);

    this.canvas.setAttribute('height', this.canvas.width * r);

    this.scaleX = this.canvas.width / parseFloat(this.canvas.clientWidth);
    this.scaleY = this.canvas.height / parseFloat(this.canvas.clientHeight);

    this.bounds.width = this.canvas.width;
    this.bounds.height = this.canvas.height;

    if (prevWidth != this.canvas.width || prevHeight != this.canvas.height) {
      this.dispatch(new Event(GraphicRendererEvents.CANVAS_RESIZE));
    }

    this.dispatch(new Event(GraphicRendererEvents.WINDOW_RESIZE));

    this.resizeHandler();
  }

  /**
   * Resize handler to be overridden by a sub-class.
   */
  resizeHandler() {
    this.debug('Resized!', this.canvasTargetWidth, this.canvasTargetHeight);
  }

  processMouseEvent(event) {
    var rect = this.canvas.getBoundingClientRect();

    return this.mouse = {
      event: event,
      canvasX: event.clientX - rect.left,
      canvasY: event.clientY - rect.top
    };
  }

  /**
   * Internal response to a browser scroll.
   *
   * @param {Event} event The scroll event.
   * @private
   */
  _scrollHandler(event) {
    var deltaY = window.pageYOffset - this.lastScrollTop;
    this.lastScrollTop = window.pageYOffset;

    this.dispatch(new Event(GraphicRendererEvents.WINDOW_SCROLL, {
      deltaY: deltaY,
      scrollTop: window.pageYOffset,
      originalEvent: event
    }));
  }

  /**
   * Called when the canvas is clicked by the mouse.
   *
   * Not called when options.mouseEnabled is false.
   */
  _canvasOnMouseClickHandler(event) {
    this.dispatch(new Event(MouseEvents.CLICK, this.processMouseEvent(event)));
  }

  /**
   * Called when the canvas has a mouse down.
   *
   * Not called when options.mouseEnabled is false.
   */
  _canvasOnMouseDownHandler(event) {
    this.dispatch(new Event(MouseEvents.MOUSE_DOWN, this.processMouseEvent(event)));
  }

  /**
   * Called when the canvas has a mouse up.
   *
   * Not called when options.mouseEnabled is false.
   */
  _canvasOnMouseUpHandler(event) {
    this.dispatch(new Event(MouseEvents.MOUSE_UP, this.processMouseEvent(event)));
  }

  /**
   * Called when the mouse moves over the canvas.
   *
   * Not called when options.mouseEnabled is false.
   */
  _canvasOnMouseMoveHandler(event) {
    this.dispatch(new Event(MouseEvents.MOUSE_MOVE, this.processMouseEvent(event)));
  }

  /**
   * Called when the mouse leaves the canvas.
   *
   * Not called when options.mouseEnabled is false.
   */
  _canvasOnMouseOutHandler(event) {
    this.dispatch(new Event(MouseEvents.MOUSE_OUT, this.processMouseEvent(event)));
  }

  /**
   * Called when a finger touches the canvas.
   *
   * Not called when options.touchEnabled is false.
   */
  _canvasOnTouchStartHandler() {
    // noop
  }

  /**
   * Called when a finger moves on the canvas.
   *
   * Not called when options.touchEnabled is false.
   */
  _canvasOnTouchMoveHandler() {
    // noop
  }

  /**
   * This method is only called once to setup the lastTime and begin
   * the render loop.
   *
   * @param {Number} timestamp The high-resolution timestamp provided by the browser.
   * @private
   */
  _onFrameFirstHandler(timestamp) {
    this.lastTime = timestamp;
    window.requestAnimationFrame(this._onFrameHandler.bind(this));
  }

  /**
   * Internal render frame handler. Called every frame after the first frame
   * call to _onFrameFirstHandler.
   *
   * @param {DOMHighResTimestamp} timestamp The high-resolution timestamp provided by the browser.
   * @private
   */
  _onFrameHandler(timestamp) {
    if (!this.enabled || this.paused === true) {
      return;
    }

    this.ctx = this.ctx || this.canvas.getContext('2d');

    window.requestAnimationFrame(this._onFrameHandler.bind(this));

    if (this.options.canvasAutoClear !== undefined) {
      if (this.options.canvasAutoClear !== true) {
        this.ctx.fillStyle = this.options.canvasAutoClear;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    this.elapsed = Math.min(0.1, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    // Revert cursor to auto if no component has set it.
    if (!this.hasCallNextFrame('setBodyCursor')) {
      this.bodyCursor = 'auto';
    }

    super._onFrameHandler(this.elapsed);

    if (this.options.debug) {
      this.ctx.font = '12px Arial white';
      this.ctx.fillStyle = 'orange';
      this.ctx.fillText(this.debugText, this.options.debugPosX, this.options.debugPosY);
    }
  }
}

export default GraphicRenderer;
