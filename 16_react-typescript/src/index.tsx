import React from 'react';
import ReactDOM from 'react-dom';
import TodosContextProvider from './store/Context';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <TodosContextProvider>
      <App />
    </TodosContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
