import React from 'react';

import {RingaComponent, Markdown, I18NModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import GraphicRenderer from '../../core/GraphicRenderer';

import './GameCanvas.scss';

class GameCanvasRenderer extends GraphicRenderer {
  resizeHandler() {
    super.resizeHandler();

    const canvasScreenWidth = this.canvas.clientWidth;
    const canvasPixelWidth = this.canvas.width;
    const canvasPixelHeight = this.canvas.height;
    const widthHeightRatio = canvasPixelHeight / canvasPixelWidth;
    const targetCanvasScreenHeight = canvasScreenWidth * widthHeightRatio;

    this.canvas.style.height = `${targetCanvasScreenHeight}px`;
  }
}

export default class Canvas extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.watchProps('game');

    this.depend(
      dependency(I18NModel, 'language')
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDidMount() {
    this.renderer = new GameCanvasRenderer(this.refs.canvas, {
      debug: false,
      canvasAutoClear: true,
      resetPixelSizeToCanvas: false,
      heightToWidthRatio: 600 / 800
    });

    this.renderer.addChild(this.props.game.gameContainer);
  }

  render() {
    return <div className="canvas">
      <h1>Game</h1>
      <canvas ref="canvas" />
    </div>;
  }
}
