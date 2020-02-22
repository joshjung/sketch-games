import React, {Component} from 'react';

import './Video.scss';

export default class Video extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {src, classes, ...rest} = this.props;

    return <div className={`video ${classes || ''}`}>
      <video {...rest}>
        <source src={src} type="video/mp4" />
      </video>
    </div>;
  }
}