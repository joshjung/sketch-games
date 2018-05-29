import React from 'react';

import {RingaComponent, Markdown, I18NModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import GraphicRenderer from '../../core/GraphicRenderer';

import './Canvas.scss';
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
    this.renderer = new GraphicRenderer(this.refs.canvas, {
      debug: false,
      canvasAutoClear: true,
      resizeToCanvas: false
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
