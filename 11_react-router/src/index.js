import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import App from './App';

ReactDOM.render(
  // wrap App component to activate React Router
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
