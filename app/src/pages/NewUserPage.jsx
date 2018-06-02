import React from 'react';

import {RingaComponent, I18NModel} from 'ringa-fw-react';
import NewUser from '../components/NewUser';

import './NewUserPage.scss';

export default class NewUserPage extends RingaComponent {
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
    return <div className="new-user-page page">
      <h1>Register New Account</h1>
      <div>Register to create games and record high scores</div>
      <br />
      <NewUser />
    </div>;
  }
}
