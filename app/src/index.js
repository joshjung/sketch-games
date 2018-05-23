console.log('BUILD INFORMATION', __BUILD__);

import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom'

import history from './global/history';

import routes from './routes';

import './styles/index.scss';

render(<Router history={history}>{routes}</Router>, document.querySelector('.react-app'));
