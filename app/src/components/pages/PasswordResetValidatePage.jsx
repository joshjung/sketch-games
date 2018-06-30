import React from 'react';

import {RingaComponent} from 'ringa-fw-react';
import PasswordResetValidate from '../PasswordResetValidate';

import './PasswordResetValidatePage.scss';

export default class PasswordResetValidatePage extends RingaComponent {
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
    return <div className="password-reset-validate-page page">
      <h1>Reset Password</h1>
      <PasswordResetValidate {...this.props} />
    </div>;
  }
}
