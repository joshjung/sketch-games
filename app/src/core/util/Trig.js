'use strict';

/**
 * Caches pythagorean calculations for all integral values from 0 to length.
 */
export class PythagoreanCache {
  /**
   * Build a PythagoreanCache for the provided length
   *
   * @param {Number} length The maximum square length size to cache.
   */
  constructor(length) {
    this.cache = [];

    for (var i = 0; i < length; i++) {
      this.cache[i] = [];

      for (var j = 0; j < length; j++) {
        this.cache[i][j] = Math.sqrt(i * i + j * j);
      }
    }

    console.log('pyth', this.cache);
  }

  /**
   * Calculate Pythagorean side length for the provided deltaX and deltaY. Sign does not matter.
   *
   * @param {Number} deltaX
   * @param {Number} deltaY
   * @returns {Number}
   */
  calc(deltaX, deltaY) {
    return this.cache[Math.round(Math.abs(deltaX))][Math.round(Math.abs(deltaY))];
  }
}

export default {
  PythagoreanCache: PythagoreanCache
};
