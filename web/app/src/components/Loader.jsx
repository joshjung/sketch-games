import React, {Component} from 'react';

import './Loader.scss';

export default class Loader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {show, zIndex} = this.props;

    return <div className={`loader ${show ? 'show' : ''}`} style={{ zIndex }}>
      <svg version="1.1" id="L3"
                x="0px" y="0px" viewBox="0 0 100 100" space="preserve">
        <circle fill="#000" stroke="#1b73b3" strokeWidth="2" cx="8" cy="54" r="7" >
          <animateTransform
            attributeName="transform"
            dur="1.75s"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite" />
        </circle>
        <circle fill="#000" stroke="#1b73b3" strokeWidth="2" cx="18" cy="54" r="6" >
          <animateTransform
            attributeName="transform"
            dur="1.5s"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite" />
        </circle>
        <circle fill="#000" stroke="#1b73b3" strokeWidth="2" cx="30" cy="54" r="4" >
          <animateTransform
            attributeName="transform"
            dur="1.1s"
            type="rotate"
            from="180 50 50"
            to="540 50 50"
            repeatCount="indefinite" />
        </circle>
        <circle fill="#000" stroke="#1b73b3" strokeWidth="2" cx="35" cy="54" r="3" >
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