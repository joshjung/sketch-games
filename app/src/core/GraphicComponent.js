'use strict';

/*============================================*\
 * Imports
 \*============================================*/
import GraphicContainer from './GraphicContainer';
import GraphicEvents from './events/GraphicEvents';
import MouseEvents from './events/MouseEvents';
import Event from './util/Event';
import Rect from './util/Rect';
import {fillRectRadius} from './util/Graphics';

/*============================================*\
 * Class
 \*============================================*/
/**
 * Base of a single component that can be added to a Canvas.
 */
class GraphicComponent extends GraphicContainer {
  //---------------------------------------------
  // Constructor
  //---------------------------------------------
  /**
   * A GraphicContainer represents the root of a single special effect to be displayed on a canvas.
   *
   * @param {Object} options The options with which to initialize the layer.
   * @param {Number} id The ID of this layer.
   */
  constructor(options, id) {
    super(options, id);

    let o = this.options;

    o.bgColor = o.bgColor || '#AAAAAA';
    o.strokeStyle = o.strokeStyle || '#333333';
    o.lineWidth = o.lineWidth || 2;
    o.cornerRadius = o.cornerRadius || 0;
    o.clip = o.clip === true ? true : false;

    this.setupFontOptions(options);

    this.bounds = o.bounds || new Rect(0,0,0,0);
    this.boundsPercent = o.boundsPercent || new Rect(NaN, NaN, NaN, NaN);
    this.padding = o.padding || new Rect(0, 0, 0, 0);
  }

  //---------------------------------------------
  // Properties
  //---------------------------------------------
  get x() {
    return isNaN(this.boundsPercent.x) ? this.bounds.x : this.boundsPercent.x * this.parent.width;
  }

  get y() {
    return isNaN(this.boundsPercent.y) ? this.bounds.y : this.boundsPercent.y * this.parent.height;
  }

  get globalX() {
    return this.parent ? this.parent.globalX + this.x : this.x;
  }

  get globalY() {
    return this.parent ? this.parent.globalY + this.y : this.y;
  }

  get width() {
    return isNaN(this.boundsPercent.width) ? this.bounds.width : this.boundsPercent.width * this.parent.width;
  }

  set width(value) {
    this.bounds.width = value;
  }

  get height() {
    return isNaN(this.boundsPercent.height) ? this.bounds.height : this.boundsPercent.height * this.parent.height;
  }

  set height(value) {
    this.bounds.height = value;
  }

  //---------------------------------------------
  // Methods
  //---------------------------------------------
  /**
   * Call a named callback next frame. If the callback is set with another name, it overrides the first.
   * Useful for setting things like the cursor, which multiple components may try to access and override but
   * only one can win.
   *
   * @param {String} name Must be one of the
   * @param {Function} callback
   */
  callNextFrame(name, callback) {
    this.nextFrameCalls = this.nextFrameCalls || {};

    this.nextFrameCalls[name] = callback;
  }

  /**
   * Returns true if there is a callback set for the provided property.
   *
   * @param {String} name The callback name to query.
   * @returns {Boolean}
   */
  hasCallNextFrame(name) {
    return this.nextFrameCalls && this.nextFrameCalls[name] !== undefined;
  }

  /**
   * Invalidate a property on this component with a new value. Value will be set at the beginning of the next frame.
   *
   * @param {String} prop The property to set.
   * @param {*} newValue The new value to assign.
   */
  invalidateProperty(prop, newValue) {
    this.invalidatedProps = this.invalidatedProps || {};

    this.invalidatedProps[prop] = newValue;
  }

  /**
   * Called once per frame by the frame handler before any drawing has begun.
   */
  validate() {
    for (var key in this.invalidatedProps) {
      this[prop] = this.invalidatedProps[prop];
    }

    for (var key in this.nextFrameCalls) {
      this.nextFrameCalls[key]();
    }

    this.invalidatedProps = {};
    this.nextFrameCalls = {};
  }

  /**
   * Setup the font options and default them if necessary.
   *
   * @param {Object} options The options to setup.
   */
  setupFontOptions(options) {
    let o = this.options;

    o.font = options.font || o.font || '12px Arial white';
    o.color = options.color || o.color || 'black';
  }

  /**
   * Measure the provided text using the current font settings of this component.
   *
   * @param {String} text The text to measure.
   * @returns {*|TextMetrics}
   */
  measureText(text) {
    let ctx = this.renderer.ctx;
    let o = this.options;

    ctx.font = o.font;
    ctx.fillStyle = o.color;

    return ctx.measureText(text);
  }

  /**
   * Renders text using this component's font styles from its options.
   *
   * @param {Number} x X coordinate of where to render the text.
   * @param {Number} y X coordinate of where to render the text.
   * @param {String} text The text to render.
   */
  renderText(x, y, text, baseline) {
    let ctx = this.renderer.ctx;
    let o = this.options;

    baseline = baseline || 'hanging';

    console.log('FONT', o.font);
    ctx.font = o.font;
    ctx.fillStyle = o.color;
    ctx.textBaseline = baseline;

    let texts = text.split('\n');
    let lineHeight = o.lineHeight || 20;

    texts.forEach((text, ix) => {
      ctx.fillText(text, this.globalX + x, this.globalY + y + (lineHeight * ix));
    });
  }

  /**
   * Converts global coordinates of the canvas into local coordinates of this component.
   *
   * @param {Number} x The global canvas x position.
   * @param {Number} y The global canvas y position.
   * @returns {vec2}
   */
  globalToLocal(x, y) {
    return vec2.fromValues(x - this.globalX, y - this.globalY);
  }

  globalInBounds(x, y) {
    return x >= this.globalX && x <= this.globalX + this.width &&
        y >= this.globalY && y <= this.globalY + this.height;
  }

  beginClip() {
    if (this.options.clip) {
      let ctx = this.renderer.ctx;
      let x = this.globalX;
      let y = this.globalY;

      ctx.save();

      ctx.beginPath();
      ctx.rect(x, y, this.width, this.height);
      ctx.clip();
    }
  }

  endClip() {
    if (this.options.clip) {
      let ctx = this.renderer.ctx;

      ctx.restore();
    }
  }

  renderBackground() {
    let ctx = this.renderer.ctx;
    let o = this.options;

    ctx.fillStyle = o.bgColor;
    ctx.strokeStyle = o.strokeStyle;
    ctx.lineWidth = o.lineWidth;

    if (o.cornerRadius) {
      fillRectRadius(ctx, this.globalX, this.globalY, this.width, this.height, o.cornerRadius);
    } else {
      ctx.fillRect(this.globalX, this.globalY, this.width, this.height);
    }
  }

  /**
   * Render the after effects like a shadow.
   */
  renderAfterEffects() {
    let o = this.options;
    let ctx = this.renderer.ctx;

    if (o.shadow) {
      ctx.save();
      this.beginClip();

      ctx.shadowColor   = o.shadow.color || 'rgba(0, 0, 0, 0.5)';
      ctx.shadowOffsetX = o.shadow.offsetX || 2;
      ctx.shadowOffsetY = o.shadow.offsetY || 2;
      ctx.shadowBlur    = o.shadow.blur || 6;

      ctx.beginPath();

      ctx.moveTo(this.globalX - 2, this.globalY - 2);
      ctx.lineTo(this.globalX + this.width + 4, this.globalY - 2);
      ctx.lineTo(this.globalX + this.width + 4, this.globalY + this.height + 4);
      ctx.lineTo(this.globalX - 2, this.globalY + this.height + 4);
      ctx.lineTo(this.globalX - 2, this.globalY - 2);

      ctx.closePath();

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,1)';
      ctx.stroke();

      this.endClip();
      ctx.restore();
    }
  }

  //---------------------------------------------
  // Events
  //---------------------------------------------
  _onFrameHandler(elapsed) {
    let o = this.options;

    if (o.cursor && this.globalInBounds(this.renderer.mouse.canvasX, this.renderer.mouse.canvasY)) {
      this.renderer.bodyCursor = o.cursor;
    }

    this.validate();

    super._onFrameHandler(elapsed);
  }
}

export default GraphicComponent;
