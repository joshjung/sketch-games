'use strict';

/**
 * @type {Number} Width of the pointer on a callout.
 */
const CALLOUT_TAIL_GIRTH = 10;
const CALLOUT_TAIL_LENGTH = 20;

/**
 * Renders a rectangle with a single corner radius for all corners.
 *
 * @param {CanvasRenderingContext2D} ctx The context on which to render.
 * @param {Number} x X coordinate of the rectangle (global).
 * @param {Number} y Y coordinate of the rectangle (global).
 * @param {Number} w Width of the rectangle.
 * @param {Number} h Height of the rectangle.
 * @param {Number} radius Radius of the rectangle.
 * @param {Boolean} autoStroke True if you want stroke() called. Default is true.
 * @param {Boolean} autoFill True if you want fill() called. Default is true.
 */
export function fillRectRadius(ctx, x, y, w, h, radius, autoStroke, autoFill) {
  autoStroke = autoStroke === undefined ? true : autoStroke;
  autoFill = autoFill === undefined ? true : autoFill;

  let cr = radius;

  ctx.beginPath();
  ctx.moveTo(x, y + cr);
  ctx.quadraticCurveTo(x, y, x + cr, y);
  // Top Line
  ctx.lineTo(x + w - cr, y);          // Upper right, UL of curve
  // Right Line
  ctx.quadraticCurveTo(x + w, y, x + w, y + cr);
  ctx.lineTo(x + w, y + h - cr);  // Lower right, UL of curve
  // Bottom Line
  ctx.quadraticCurveTo(x + w, y + h, x + w - cr, y + h);
  ctx.lineTo(x + cr, y + h);  // Lower left, LR of curve
  // Left Line
  ctx.quadraticCurveTo(x, y + h, x, y + h - cr);
  ctx.lineTo(x, y + cr);              // Upper left, LL of curve

  ctx.closePath();

  if (autoStroke) {
    ctx.stroke();
  }
  if (autoFill) {
    ctx.fill();
  }
};

/**
 * Render a callout background similar to a comic-book style text box. Assumes that you
 * have manually set the context fill and stroke styles before being called.
 *
 * @param {CanvasRenderingContext2D} ctx The context on which to render.
 * @param {Number} x The global x coordinate on the canvas.
 * @param {Number} y The global y coordinate on the canvas.
 * @param {Number} w The width of the entire callout.
 * @param {Number} h The height of the entire callout. Includes the callout point.
 * @param {Number} xTarget The xTarget of the callout to attempt to point at. For calloutSide 'top' and 'bottom'.
 *   Default is undefined.
 * @param {Number} yTarget The yTarget of the callout to attempt to point at. For calloutSide 'left' and 'right'.
 *   Default is undefined.
 * @param {Number} radius The radius of the corners of the callout.
 * @param {String} calloutSide Under construction, but right now can only be 'bottom'.
 * @param {Boolean} autoStroke True if you want stroke() called. Default is true.
 * @param {Boolean} autoFill True if you want fill() called. Default is true.
 */
export function fillCallout(ctx, x, y, w, h, xTarget, yTarget, radius, calloutSide, autoStroke, autoFill, calloutTailLength, calloutTailGirth) {
  xTarget = xTarget || x + w - radius;

  let ctl = calloutTailLength || CALLOUT_TAIL_LENGTH;
  let ctg = calloutTailGirth || CALLOUT_TAIL_GIRTH;

  autoStroke = autoStroke === undefined ? true : autoStroke;
  autoFill = autoFill === undefined ? true : autoFill;

  calloutSide = calloutSide || 'bottom';
  radius = radius || 10;

  let cr = radius;

  if (calloutSide === 'top' || calloutSide === 'bottom') {
    h = h - ctl;
  } else {
    w = w - ctg;
  }

  ctx.beginPath();
  ctx.moveTo(x, y + cr);
  ctx.quadraticCurveTo(x, y, x + cr, y);
  // Top Line
  ctx.lineTo(x + w - cr, y);          // Upper right, UL of curve
  // Right Line
  ctx.quadraticCurveTo(x + w, y, x + w, y + cr);
  ctx.lineTo(x + w, y + h - cr);  // Lower right, UL of curve
  // Bottom Line
  ctx.quadraticCurveTo(x + w, y + h, x + w - cr, y + h);

  if (calloutSide === 'bottom') {
    let xLim = Math.min(Math.max(x + cr, xTarget), x + w - cr);
    let rl = xLim > x + (w / 2) ? 'r' : 'l'; // Right or left pointing tail?
    let trx = rl === 'r' ? xLim : xLim + ctg;
    let tlx = rl === 'r' ? xLim - ctg : xLim;

    ctx.lineTo(trx, y + h);
    ctx.lineTo(rl === 'r' ? trx : tlx, y + h + ctl);
    ctx.lineTo(tlx, y + h);
    ctx.lineTo(x + cr, y + h);
  } else {
    ctx.lineTo(x + cr, y + h);  // Lower left, LR of curve
  }
  // Left Line
  ctx.quadraticCurveTo(x, y + h, x, y + h - cr);
  ctx.lineTo(x, y + cr);              // Upper left, LL of curve
  ctx.closePath();

  if (autoStroke) {
    ctx.stroke();
  }
  if (autoFill) {
    ctx.fill();
  }
}

/**
 * Given a Rect A and a Rect B and a target vec2, returns a vec2 that assures that repositions Rect A so that
 * the majority of it fits within Rect B.
 *
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {vec2}
 */
export function fit(rectA, rectB) {
  let x = rectA.left;
  let y = rectA.top;
  if (rectA.left < rectB.left) {
    x = rectB.left;
  }
  if (rectA.left + rectA.width > rectB.left + rectB.width) {
    x = rectB.right - rectA.width;
  }
  if (rectA.top < rectB.top) {
    y = rectB.top;
  }
  if (rectA.top + rectA.height > rectB.top + rectB.height) {
    y = rectB.bottom - rectA.height;
  }

  return vec2.fromValues(x, y);
}

export default {
  fillRectRadius,
  fillCallout,
  fit
};
