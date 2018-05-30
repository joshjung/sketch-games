import React from 'react';

import {Model} from 'ringa';

import {RingaComponent, I18NModel, TextInput, Button} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import history from '../global/history';

import APIController from '../controllers/APIController';

const NewUserModel = Model.construct('NewUserModel', [{
  name: 'name',
  default: ''
},{
  name: 'email',
  default: ''
}, {
  name: 'password',
  default: ''
}]);

export default class NewUser extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(
      dependency(I18NModel, 'language')
    );

    this.newUser = new NewUserModel();
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    return <div className="newUser">
      Name:
      <TextInput model={this.newUser} modelField="name"/>
      Email:
      <TextInput model={this.newUser} modelField="email"/>
      Password:
      <TextInput model={this.newUser} modelField="password" type="password"/>
      <Button label="Create" onClick={this.newUser_onClickHandler} />
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  newUser_onClickHandler() {
    this.dispatch(APIController.CREATE_USER, {
      body: {
        email: this.newUser.email,
        password: this.newUser.password,
        name: this.newUser.name,
        access_token: 'QiW54Gu0IqrYE6v8zHOSzqVdbIeiHknn'
      }
    }).then(success => {
      if (success) {
        history.replace('/games');
      }
    });
  }
}
