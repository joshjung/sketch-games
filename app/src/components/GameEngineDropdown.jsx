import React from 'react';

import {Dropdown} from 'ringa-fw-react';

import Engines from '../engines';

import './GameEngineDropdown.scss';

import classnames from 'classnames';

export default class GameEngineDropdown extends Dropdown {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {onChange, ...rest} = this.props;

    return <Dropdown placeholder="Select Game Engine..."
                     itemRenderer={this.engineRenderer}
                     items={Engines}
                     labelField="title"
                     onChange={onChange} {...rest} />;
  }

  engineRenderer(itemSelectHandler, engine) {
    let cn = classnames('item engine');

    return <div className={cn}
                key={engine.id}
                onClick={itemSelectHandler.bind(undefined, engine)}>
      <div className="title">{engine.title}</div>
      <div className="description">{engine.description}</div>
    </div>;
  }
}
