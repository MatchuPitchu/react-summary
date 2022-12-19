import { useAppDispatch } from '../../store/hooks';
import { cartActions } from '../../store/cart-slice';
import classes from './CartItem.module.css';

const CartItem = ({ id, title, price, quantity }) => {
  const dispatch = useAppDispatch();
  const removeItemHandler = () => dispatch(cartActions.removeItemFromCart(id));
  const addItemHandler = () => dispatch(cartActions.addItemToCart({ id, title, price }));

  const totalPrice = price * quantity;

  return (
    <li className={classes.item}>
      <header>
        <h3>{title}</h3>
        <div className={classes.price}>
          ${totalPrice.toFixed(2)}{' '}
          <span className={classes.itemprice}>(${price.toFixed(2)}/item)</span>
        </div>
      </header>
      <div className={classes.details}>
        <div className={classes.quantity}>
          x <span>{quantity}</span>
        </div>
        <div className={classes.actions}>
          <button onClick={removeItemHandler}>-</button>
          <button onClick={addItemHandler}>+</button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
