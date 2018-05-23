import React from 'react';

import {RingaComponent, I18NModel, Button} from 'ringa-fw-react';

import moment from 'moment';

import {depend, dependency} from 'react-ringa';

import './Footer.scss';

class Footer extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    depend(this, dependency(I18NModel, 'language'));
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render(props) {
    const {i18NModel} = this.state;

    return <header className="app-footer">
      <div className="build">
        {i18NModel.i18n('misc.version')}&nbsp;
        {__BUILD__.package.version}&nbsp;
        {i18NModel.i18n('misc.built')}&nbsp;
        {moment(__BUILD_EPOCH__).fromNow()}
      </div>
    </header>;
  }
}

export default Footer;
