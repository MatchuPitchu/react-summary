import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContextProvider as Provider } from './context/AuthContext';

import './index.css';
import App from './App';

ReactDOM.render(
  <Provider>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
