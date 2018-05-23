import React from 'react';

import {RingaComponent, I18NModel} from 'ringa-fw-react';
import {dependency, attach} from 'react-ringa';

import EditGame from '../components/games/EditGame';

import './PlaygroundPage.scss';

export default class EditGamePage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(dependency(I18NModel, 'language'));
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {i18NModel} = this.state;

    return <div className="editGamePage">
      <EditGame />
    </div>;
  }
}
