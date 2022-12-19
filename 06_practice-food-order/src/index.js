import ReactDOM from 'react-dom';
import CartStateProvider from './store/CartContext';
import App from './App';
import './index.css';

ReactDOM.render(
  // provide context to all components between CartStateProvider elements
  <CartStateProvider>
    <App />
  </CartStateProvider>,
  document.getElementById('root')
);
