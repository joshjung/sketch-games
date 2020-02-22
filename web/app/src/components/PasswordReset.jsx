import React from 'react';

import {RingaComponent, TextInput, Button, ScreenModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

import APIController from '../controllers/APIController';

import './PasswordReset.scss';

export default class PasswordReset extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.state = {
      error: undefined,
      email: undefined,
      success: false
    };

    this.depend(
      dependency(ScreenModel, 'curBreakpointIx')
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {email, error, success} = this.state;

    if (success) {
      return <div className="password-reset">
        <h3>An email has been sent to your account with a link to reset your password.</h3>
      </div>;
    }

    return <div className="password-reset">
      <label>Email</label>
      <TextInput value={email} onChange={this.email_onChangeHandler} onEnterKey={this.email_onEnterKeyHandler}/>
      {error && <div className="warning-card">The email you provided does not exist in our system</div>}
      <div className="actions">
        <Button label="Reset Password" onClick={this.reset_onClickHandler} />
      </div>
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  email_onChangeHandler(event) {
    this.setState({
      email: event.target.value
    });
  }

  email_onEnterKeyHandler() {
    this.reset_onClickHandler();
  }

  reset_onClickHandler() {
    if (!EMAIL_REGEX.test(this.state.email)) {
      this.setState({
        error: 'Please enter a valid email'
      });
      return;
    }

    this.dispatch(APIController.RESET_PASSWORD, {
      body: {
        email: this.state.email,
        access_token: 'QiW54Gu0IqrYE6v8zHOSzqVdbIeiHknn',
        link: PASSWORD_RESET_REDIRECT_URI
      }
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
}
