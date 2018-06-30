'use strict';

/**
 * Returns a random number between min and max.
 *
 * @param {Number} min Minimum value of the random number.
 * @param {Number} max Maximum value of the random number.
 * @returns {Number}
 */
export function ran(min, max) {
  return Math.random() * (max - min) + min;
};

/**
 * Returns a skewed random number, either skewed toward the min
 * or the max.
 *
 * @param {Number} min Minimum value of the random number.
 * @param {Number} max Maximum value of the random number.
 * @param {Number} skew Negative value to skew toward min and positive to skew toward max. Must be between -1 and 1.
 * @returns {Number}
 */
export function ranSkew(min, max, skew) {
  let root = ran(min, max);

  return root + (skew < 0 ? root - min : max - root) * skew;
};

/**
 * Returns -1 or 1 randomly.
 *
 * @returns {Number} -1 or 1.
 */
export function ranSign() {
  return Math.random() < 0.5 ? -1 : 1;
}

export default {
  ran: ran,
  ranSkew: ranSkew
};
