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
      <div>Your own account gives you the ability to:
        <ul>
          <li>Build your own games</li>
          <li>Record high scores</li>
        </ul>
      </div>
      <br />
      <NewUser />
    </div>;
  }
}
