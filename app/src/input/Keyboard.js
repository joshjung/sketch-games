export default class Keyboard {
  constructor() {
    this.active = true;
    this.keys = {};
    this.keyCodes = {
      LEFT: 37,
      RIGHT: 39,
      UP: 38,
      DOWN: 40,
      SPACE: 32,
      A: 65,
      B: 66,
      C: 67,
      D: 68,
      E: 69,
      F: 70,
      G: 71,
      H: 72,
      I: 73,
      J: 74,
      K: 75,
      L: 76,
      M: 77,
      N: 78,
      O: 79,
      P: 80,
      Q: 81,
      R: 82,
      S: 83,
      T: 84,
      U: 85,
      V: 86,
      W: 87,
      X: 88,
      Y: 89,
      Z: 90,
      '0': 48,
      '1': 49,
      '2': 50,
      '3': 51,
      '4': 52,
      '5': 53,
      '6': 54,
      '7': 55,
      '8': 56,
      '9': 57
    };

    window.addEventListener('keydown', this.keydownHandler.bind(this));
    window.addEventListener('keyup', this.keyupHandler.bind(this));

    this.keyDown = this.keyDown.bind(this);
  }

  keydownHandler(event) {
    this.keys[event.keyCode] = true;
  }

  keyupHandler(event) {
    this.keys[event.keyCode] = false;
  }

  keyDown(code) {
    return this.keys[code];
  }
}