import React from 'react';

import {Model} from 'ringa';

import {RingaComponent, I18NModel, TextInput, Button, ScreenModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import history from '../util/history';

import APIController from '../controllers/APIController';

import './Login.scss';

const LoginModel = Model.construct('LoginModel', ['email', 'password']);

export default class Login extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.state = {
      error: false
    };

    this.depend(
      dependency(I18NModel, 'language'),
      dependency(ScreenModel, 'curBreakpointIx')
    );

    this.login = new LoginModel();
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {error} = this.state;

    return <div className="login">
      <label>Email</label>
      <TextInput model={this.login} modelField="email" onEnterKey={this.email_onEnterKeyHandler}/>
      <label>Password</label>
      <TextInput model={this.login} modelField="password" type="password" onEnterKey={this.password_onEnterKeyHandler}/>
      {error && <div className="warning-card">Invalid login!</div>}
      <div className="actions">
        <Button label="Login" classes="highlight" onClick={this.login_onClickHandler} />
        <Button label="Register" onClick={this.register_onClickHandler} />
        <Button label="Forgot Password?" onClick={this.forgotPassword_onClickHandler} />

      </div>

    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  email_onEnterKeyHandler() {
    this.login_onClickHandler();
  }

  password_onEnterKeyHandler() {
    this.login_onClickHandler();
  }

  login_onClickHandler() {
    const {curBreakpointIx} = this.state;

    this.dispatch(APIController.LOGIN, {
      body: {
        email: this.login.email,
        password: this.login.password,
        access_token: 'QiW54Gu0IqrYE6v8zHOSzqVdbIeiHknn'
      }
    }).then(success => {
      if (success) {
        if (curBreakpointIx > 3) {
          history.replace('/games/mine');
        } else {
          history.replace('/');
        }
      } else {
        this.setState({
          error: true
        });
      }
    });
  }

  register_onClickHandler() {
    history.replace('/user/create');
  }

  forgotPassword_onClickHandler() {
    history.replace('/account/password/reset');
  }
}
