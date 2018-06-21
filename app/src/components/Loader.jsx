import React, {Component} from 'react';

import './Loader.scss';

export default class Loader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {show} = this.props;

    return <div className={`loader ${show ? 'show' : ''}`}>
      <svg version="1.1" id="L3"
                x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" space="preserve">
        <circle fill="#eee" stroke="#333" strokeWidth="4" cx="50" cy="50" r="44" style={{ opacity: 0.5 }}/>
        <circle fill="#eee" stroke="#333" strokeWidth="2" cx="50" cy="50" r="22" style={{ opacity: 0.5 }}/>
        <circle fill="#000" stroke="#1b73b3" strokeWidth="3" cx="8" cy="54" r="6" >
          <animateTransform
            attributeName="transform"
            dur="1.75s"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite" />
        </circle>
        <circle fill="#000" stroke="#1b73b3" strokeWidth="2" cx="30" cy="54" r="4" >
          <animateTransform
            attributeName="transform"
            dur="0.75s"
            type="rotate"
            from="180 50 50"
            to="540 50 50"
            repeatCount="indefinite" />
        </circle>
      </svg>
    </div>;
  }
}