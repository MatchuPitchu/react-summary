import ReactDOM from 'react-dom';

import './index.css'; // this import wouldn't work in Vanilla JS
import App from './App'; // if 3rd party library (-> like 'react-dom') or a JS file, then omit extension

ReactDOM.render(
  <App />,
  document.getElementById('root') // call default JS DOM API on the browser side global obj (-> document)
);
