export default class Keyboard {
  constructor() {
    this.active = true;
    this.keys = {};
    this.keyCodes = {
      LEFT: 37,
      RIGHT: 39,
      UP: 38,
      DOWN: 40
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