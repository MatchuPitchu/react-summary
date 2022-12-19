import { useState } from 'react';
import Header from './components/Layout/Header';
import Meals from './components/Meals/Meals';
import Cart from './components/Cart/Cart';

const App = () => {
  const [cartVisible, setCartVisible] = useState(false);

  const showCartHandler = () => setCartVisible(true);
  const hideCartHandler = () => setCartVisible(false);

  return (
    <>
      {cartVisible && <Cart onClose={hideCartHandler} />}
      <Header onShowCart={showCartHandler} />
      <main>
        <Meals />
      </main>
    </>
  );
};

export default App;
