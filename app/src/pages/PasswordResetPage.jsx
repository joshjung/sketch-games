import React from 'react';

import {RingaComponent} from 'ringa-fw-react';
import PasswordReset from '../components/PasswordReset';

import './PasswordResetPage.scss';

export default class PasswordResetPage extends RingaComponent {
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
    return <div className="password-reset-page page">
      <h1>Reset Password</h1>
      <PasswordReset />
    </div>;
  }
}
