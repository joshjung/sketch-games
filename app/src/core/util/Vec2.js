/**
 * Returns true if p2 is above p1.
 *
 * @param {vec2} v1 gl-matrix vec2
 * @param {vec2} v2 gl-matrix vec2
 * @returns {Boolean}
 */
export function isAbove(v1, v2) {
  return v1[1] < v2[1];
}

/**
 * Returns true if v2 is below v1.
 *
 * @param {vec2} v1 gl-matrix vec2
 * @param {vec2} v2 gl-matrix vec2
 * @returns {Boolean}
 */
export function isBelow(v1, v2) {
  return v1[1] > v2[1];
}

/**
 * Returns true if v2 is left of v1.
 *
 * @param {vec2} v1 Point
 * @param {vec2} v2 Point
 * @returns {Boolean}
 */
export function isLeft(v1, v2) {
  return v1[0] < v2[0];
}

/**
 * Returns true if v2 is right of v1.
 *
 * @param {vec2} v1 Point
 * @param {vec2} v2 Point
 * @returns {Boolean}
 */
export function isRight(v1, v2) {
  return v1[0] > v2[0];
}

export default {
  isAbove: isAbove,
  isBelow: isBelow,
  isLeft: isLeft,
  isRight: isRight
};
