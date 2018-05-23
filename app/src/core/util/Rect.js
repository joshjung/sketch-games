'use strict';

import {ran} from './Number';
import {Sides} from './Sides';

/*---------------------------------------------------------------------------*\
 * Rect
 *
 * Define a rectangle with x, y, width, height
\*---------------------------------------------------------------------------*/
class Rect {
  //------------------------------------
  // Constructor
  //------------------------------------
  /**
   * Build a Rect object.
   *
   * @param {Number} x Left
   * @param {Number} y Top
   * @param {Number} width Width of rectangle
   * @param {Number} height Height of rectangle
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y === undefined ? x : y;
    this.width = width === undefined ? x : width;
    this.height = height === undefined ? x : height;
  }

  //------------------------------------
  // Properties
  //------------------------------------
  /**
   * Returns the right edge of the Rect.
   *
   * @returns {Number}
   */
  get right() {
    return this.x + this.width;
  }

  set right(value) {
    this.width = value - this.x;
  }

  /**
   * Returns the left edge of the Rect.
   *
   * @returns {Number}
   */
  get left() {
    return this.x;
  }

  set left(value) {
    this.x = value;
  }

  /**
   * Returns the bottom edge of the Rect.
   *
   * @returns {Number}
   */
  get bottom() {
    return this.y + this.height;
  }

  set bottom(value) {
    this.height = value - this.y;
  }

  /**
   * Returns the top edge of the Rect.
   *
   * @returns {Number}
   */
  get top() {
    return this.y;
  }

  set top(value) {
    this.y = value;
  }

  //------------------------------------
  // Methods
  //------------------------------------
  /**
   * Returns true if the provide x,y is within this Rect.
   *
   * @param {Number} x
   * @param {Number} y
   * @returns {Boolean}
   */
  isBounding(x, y) {
    return x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height;
  }

  /**
   * Returns true if the provided gl-matrix vec2 object is within this Rect.
   *
   * @param {vec2} v
   * @returns {Boolean}
   */
  isBoundingVec2(v) {
    return v[0] >= this.x && v[1] >= this.y && v[0] <= this.x + this.width && v[1] <= this.y + this.height;
  }

  /**
   * Returns a random point along the given side given the provided Rect.
   *
   * @param {Number} side
   * @returns {vec2}
   */
  getRanVec2For(side) {
    let x = 0;
    let y = 0;

    x = side == Sides.RIGHT ? this.right : x;
    x = side == Sides.TOP || side == Sides.BOTTOM ? ran(0, this.right) : x;

    y = side == Sides.BOTTOM ? rect.bottom : y;
    y = side == Sides.LEFT || side == Sides.RIGHT ? ran(0, this.bottom) : y;

    return vec2.fromValues(x, y);
  }
}

export default Rect;
