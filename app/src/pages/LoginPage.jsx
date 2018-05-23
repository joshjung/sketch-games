import React from 'react';

import {RingaComponent, I18NModel} from 'ringa-fw-react';
import Login from '../components/Login';

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
    return <div className="login">
      <Login />
    </div>;
  }
}
