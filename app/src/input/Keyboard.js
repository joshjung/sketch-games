export default class Keyboard {
  static KEY_CODES = {
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
    '9': 57,
    ENTER: 13
  };

  static KEY_CODE_NAMES = {
    '37': 'Left',
    '39': 'Right',
    '38': 'Up',
    '40': 'Down',
    '32': 'Space',
    '13': 'Enter'
  };

  constructor(game) {
    this.active = true;
    this.keys = {};
    this.keyCodes = Keyboard.KEY_CODES;

    window.addEventListener('keydown', this.keydownHandler.bind(this));
    window.addEventListener('keyup', this.keyupHandler.bind(this));

    this.game = game;

    this.keyDown = this.keyDown.bind(this);
  }

  keyDown(keyCode) {
    this.game.listeningKeys = this.game.listeningKeys ? Object.assign({}, this.game.listeningKeys) : {};
    this.game.listeningKeys[keyCode] = true;

    return this.keys[keyCode];
  }

  press(keyCode) {
    this.keys[keyCode] = true;

    this.game.activeKeys = this.game.activeKeys || {};
    this.game.activeKeys[keyCode] = true;
  }

  release(keyCode) {
    this.keys[keyCode] = false;

    if (this.game.activeKeys) {
      if (this.game.activeKeys[keyCode]) {
        delete this.game.activeKeys[keyCode];
      }

      if (Object.keys(this.game.activeKeys).length === 0) {
        this.game.activeKeys = undefined;
      }
    }
  }

  keydownHandler(event) {
    this.press(event.keyCode)
  }

  keyupHandler(event) {
    this.release(event.keyCode);
  }
}