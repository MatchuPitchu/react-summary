import { useState } from 'react';
// import Testing from './exerciseOne/Testing';
import { OrderContextProvider } from './store/OrderContext';
import { Container } from 'react-bootstrap';

import OrderEntry from './pages/entry/OrderEntry';
import OrderSummary from './pages/summary/OrderSummary';
import OrderConfirmation from './pages/confirmation/OrderConfirmation';

import './App.css';

const App = () => {
  // orderPhase needs to be 'inProgress', 'review' or 'completed'
  const [orderPhase, setOrderPhase] = useState('inProgress');

  let Component = OrderEntry; // default to order page
  switch (orderPhase) {
    case 'inProgress':
      Component = OrderEntry;
      break;
    case 'review':
      Component = OrderSummary;
      break;
    case 'completed':
      Component = OrderConfirmation;
      break;
    default:
  }

  return (
    <div className='app'>
      {/* <Testing /> */}
      <OrderContextProvider>
        <Container>{<Component setOrderPhase={setOrderPhase} />}</Container>
      </OrderContextProvider>
    </div>
  );
};

export default App;
