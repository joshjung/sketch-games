import React from 'react';

import {Model} from 'ringa';

import {RingaComponent, I18NModel, TextInput, Button, ScreenModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import history from '../global/history';

import APIController from '../controllers/APIController';

import './NewUser.scss';

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

    this.state = {
      error: undefined
    };

    this.depend(
      dependency(I18NModel, 'language'),
      dependency(ScreenModel, 'breakpointIx')
    );

    this.newUser = new NewUserModel();
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {error} = this.state;

    return <div className="new-user">
      <label>Username</label>
      <TextInput model={this.newUser} modelField="name"/>
      <label>Email</label>
      <TextInput model={this.newUser} modelField="email"/>
      <label>Password</label>
      <TextInput model={this.newUser} modelField="password" type="password"/>
      {error && <div className="error">{error}</div>}
      <Button label="Create" onClick={this.newUser_onClickHandler} />
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  newUser_onClickHandler() {
    const {breakpointIx} = this.state;

    this.dispatch(APIController.CREATE_USER, {
      body: {
        email: this.newUser.email,
        password: this.newUser.password,
        name: this.newUser.name,
        access_token: 'QiW54Gu0IqrYE6v8zHOSzqVdbIeiHknn'
      }
    }).then((success, error) => {
      if (success) {
        if (breakpointIx > 2) {
          history.replace('/games/mine');
        } else {
          history.replace('/');
        }
      } else {
        this.setState({
          error
        });
      }
    });
  }
}
