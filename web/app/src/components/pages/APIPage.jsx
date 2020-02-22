import React from 'react';

import {RingaComponent, Markdown, I18NModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import './APIPage.scss';

export default class APIPage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(
      dependency(I18NModel, 'language'),
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {i18NModel} = this.state;
    return <div className="api-page page">
      <Markdown markdown={i18NModel.i18n('api')} />
    </div>;
  }
}
