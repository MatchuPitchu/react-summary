import React from 'react';
import ReactDOM from 'react-dom';
// import Redux Provider component and use it like for React Context
// wrapped components with all there childs have access to redux
import { Provider } from 'react-redux';
// import your specific desired redux store
import store from './store/index';

import './index.css';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
