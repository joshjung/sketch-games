export default class Mouse {
  constructor(canvas) {
    this.active = true;

    this.mouseX = -1;
    this.mouseY = -1;

    this.canvas = canvas;
    canvas.addEventListener('mouseleave', this.canvas_mouseLeaveHandler.bind(this));
    canvas.addEventListener('mousemove', this.canvas_mouseMoveHandler.bind(this));
  }

  canvas_mouseLeaveHandler(event) {
    this.mouseX = this.mouseY = -1;
  }

  canvas_mouseMoveHandler(event) {
    let ratio = this.canvas.width / this.canvas.clientWidth;
    this.mouseX = event.offsetX * ratio;
    this.mouseY = event.offsetY * ratio;
  }
}