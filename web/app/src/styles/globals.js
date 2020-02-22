import React from 'react';
import { ModalModel } from 'ringa-fw-react';

ModalModel.CLOSE_BUTTON = (closeHandler) => {
  return <div className="modal-close-btn" onClick={closeHandler}><i className="fa fa-close"/></div>;
};
