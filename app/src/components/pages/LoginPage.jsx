import React from 'react';

import {RingaComponent} from 'ringa-fw-react';
import Login from '../Login';

import './LoginPage.scss';

export default class LoginPage extends RingaComponent {
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
    return <div className="login-page page">
      <h1>Login</h1>
      <Login />
    </div>;
  }
}
