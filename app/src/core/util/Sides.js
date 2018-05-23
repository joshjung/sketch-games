'use strict';

/**
 * Sides enumeration.
 *
 * @type {{LEFT: Number, TOP: Number, RIGHT: Number, BOTTOM: Number, ran: Function}}
 */
export const Sides = {
  LEFT: 1,
  TOP: 2,
  RIGHT: 3,
  BOTTOM: 4,
  ran: function() {
    return Math.floor(ran(1, 4.99));
  }
};

/**
 * Returns the reverse of the provided direction
 *
 * @param {Number} dir Direction as provided via the Sides enumeration.
 * @returns {Boolean}
 */
export function reverseOf(dir) {
  return (((dir - 1) + 2) % 4) + 1; // Opposite of LEFT (1) is RIGHT (3) etc.
}

/**
 * Returns an Array of all Sides from v1 that face v2.
 *
 * @param {vec2} v1
 * @param {vec2} v2
 * @returns {Array}
 */
export function toward(v1, v2) {
  var dir = [];

  if (isAbove(v1, v2)) dir.push(4);
  else if (isBelow(v1, v2)) dir.push(2);

  if (isLeft(v1, v2)) dir.push(3);
  else if (isRight(v1, v2)) dir.push(1);

  return dir;
}

/**
 * Returns a gl-matrix vec2 object for the given side.
 *
 * @param {Number} side See Sides enum.
 * @returns {vec2}
 */
export function vecFor(side) {
  if (side == Sides.LEFT) return vec2.fromValues(-1, 0);
  if (side == Sides.RIGHT) return vec2.fromValues(1, 0);
  if (side == Sides.TOP) return vec2.fromValues(0, -1);
  if (side == Sides.BOTTOM) return vec2.fromValues(0, 1);
  return undefined;
}

export default {
  Sides: Sides,
  reverseOf: reverseOf,
  toward: toward,
  vecFor: vecFor
};
