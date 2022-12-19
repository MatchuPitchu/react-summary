import { useAppSelector } from '../../store/hooks';
import Card from '../UI/Card';
import classes from './Cart.module.css';
import CartItem from './CartItem';

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.items);

  return (
    <Card className={classes.cart}>
      <h2>Your Shopping Cart</h2>
      <ul>
        {cartItems.map(({ id, title, price, quantity }) => (
          <CartItem key={id} id={id} title={title} price={price} quantity={quantity} />
        ))}
      </ul>
    </Card>
  );
};

export default Cart;
