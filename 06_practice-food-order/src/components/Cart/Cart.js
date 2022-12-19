import { useContext, useState } from 'react';
import { CartContext } from '../../store/CartContext';
import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import Checkout from './Checkout';

const Cart = ({ onClose }) => {
  const { items, totalAmount, addItem, removeItem, clearCart } = useContext(CartContext);
  const [checkout, setCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const total = `${totalAmount.toFixed(2)} €`;
  const hasItems = items.length > 0;

  const cartItemRemoveHandler = (id) => {
    removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    // use spread operator and overwrite amount to 1
    // because add Btn in <CartItem/> should always only add 1 more,
    // NOT add the same amount of this item always in the storage
    addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => setCheckout(true);

  const submitOrderHandler = async (userData) => {
    setSubmitting(true);
    const options = {
      method: 'POST',
      body: JSON.stringify({
        user: userData,
        order: items,
      }),
    };

    // in real case ADD error handling
    // .json in URL is Firebase specific
    await fetch(
      'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/orders.json',
      options
    );
    setSubmitting(false);
    setDidSubmit(true);
    clearCart();
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          // bind preconfigures a function for future execution and allows you to
          // preconfigure the argument that function will receive when it's been executed;
          // bind is needed because here I can only point at these functions, cannot use fnName()
          // because this would execute function directly
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={onClose}>
        Close
      </button>
      {/* only render button if items in Cart */}
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <>
      {' '}
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{total}</span>
      </div>
      {checkout ? <Checkout onSubmit={submitOrderHandler} onCancel={onClose} /> : modalActions}
    </>
  );

  const submittingModalContent = <p>Sending order data ...</p>;
  const didSubmitModalContent = (
    <>
      <p>Successfully sent the order</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );

  return (
    // return JSX code in a modal wrapper
    <Modal onClose={onClose}>
      {!submitting && !didSubmit && cartModalContent}
      {submitting && submittingModalContent}
      {!submitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
