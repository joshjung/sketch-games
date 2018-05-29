import React from 'react';

import {RingaComponent, I18NModel} from 'ringa-fw-react';
import NewUser from '../components/NewUser';

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
    return <div className="newUserPage">
      <NewUser />
    </div>;
  }
}
