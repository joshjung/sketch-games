import React from 'react';

import {RingaComponent, TextInput, Button, ScreenModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import APIController from '../controllers/APIController';

import './PasswordResetValidate.scss';

import history from '../global/history';

export default class PasswordResetValidate extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      password: undefined,
      success: false,
      badToken: false
    };

    this.depend(
      dependency(ScreenModel, 'curBreakpointIx')
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDispatchReady() {
    this.dispatch(APIController.RESET_PASSWORD_TOKEN_VALIDATE, {
      token: this.props.match.params.token
    }).then((success, $detail) => {
      if (success) {
        this.setState({
          badToken: false
        });
      } else {
        this.setState({badToken: true});
      }
    });
  }
  render() {
    const {password, error, success, badToken} = this.state;

    if (success) {
      return <div className="password-reset">
        <h3>Password reset successfully</h3>
      </div>;
    }

    if (badToken) {
      return <div className="password-reset">
        <h3>The token you have provided has expired.</h3>
        <Button label="Send a new one" onClick={this.sendANewOne_onClickHandler} />
      </div>;
    }

    return <div className="password-reset">
      <label>New Password</label>
      <TextInput value={password} type="password" onChange={this.password_onChangeHandler} onEnterKey={this.password_onEnterKeyHandler}/>
      {error && <div>Please enter a password at least 6 characters long.</div>}
      <div className="actions">
        <Button label="Reset Password" onClick={this.reset_onClickHandler} />
      </div>
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  password_onChangeHandler(event) {
    this.setState({
      password: event.target.value
    });
  }

  password_onEnterKeyHandler() {
    this.reset_onClickHandler();
  }

  reset_onClickHandler() {
    if (!this.state.password) {
      this.setState({
        error: 'Please enter a valid password'
      });
    }

    this.dispatch(APIController.RESET_PASSWORD_VALIDATE, {
      body: {
        password: this.state.password,
        access_token: 'QiW54Gu0IqrYE6v8zHOSzqVdbIeiHknn',
      },
      token: this.props.match.params.token
    }).then((success, $detail) => {
      if (success) {
        this.setState({
          success: true
        });
      } else {
        this.setState({error: $detail.error});
      }
    });
  }

  sendANewOne_onClickHandler() {
    history.push('/account/password/reset');
  }
}
