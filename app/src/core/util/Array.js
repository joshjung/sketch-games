/**
 * Returns a random item from the provided Array.
 *
 * @param {Array} arr Array from which to select a random item.
 * @returns {*}
 */
export function ranItem(arr) {
  return arr[Math.floor(ran(0, arr.length - 0.000001))];
};

export default {
  ranItem: ranItem
};
