import { useAppDispatch } from '../../store/hooks';
import { cartActions } from '../../store/cart-slice';
import Card from '../UI/Card';
import classes from './ProductItem.module.css';

const ProductItem = ({ id, title, price, description }) => {
  // const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const addToCartHandler = () => {
    // 1) First approach (NOT recommended) to perform async tasks with Redux:
    // duplicate data transformation logic of Redux reducer before sending data to backend;
    // Problems:
    // a) code duplication: whenever I want to send data, I have to transform it first before sending (-> could outsource this into an external function)
    // b) this approach replaces all logic from Redux reducers into the components, reducers would then only get and store data

    // Attention: here DON'T mutate state -> example: const cart.totalQuantity += 1;
    // const newTotalQuantity = cart.totalQuantity + 1;

    // // create (shallow!) copy to avoid mutating (if you have objects/arrays in this array,
    // // than use spread operator also on this level)
    // const updatedItems = [...cart.items];
    // const existingItem = updatedItems.find((item) => item.id === id);
    // if (existingItem) {
    //   // new object + (shallow!) copy existing properties (if you have nested objects/arrays on 2nd level,
    //   // you have to use spread operator also on 2nd level -> const updatedItem = { ...existingItem, nestedObj: { ...existingItem.nestedObj}})
    //   const updatedItem = { ...existingItem };
    //   updatedItem.quantity++;
    //   updatedItem.price += price;
    //   const existingItemIndex = updatedItems.findIndex((item) => item.id === id);
    //   updatedItems[existingItemIndex] = updatedItem;
    // } else {
    //   updatedItems.push({
    //     id,
    //     title,
    //     price,
    //     quantity: 1,
    //   });
    // }

    // const newCart = {
    //   totalQuantity: newTotalQuantity,
    //   items: updatedItems,
    // };

    // dispatch(cartActions.replaceCart(newCart));
    // then send HTTP request
    // fetch('firebase-url', { method: 'POST', body: JSON.stringify(newCart)})

    dispatch(cartActions.addItemToCart({ id, title, price }));
  };

  return (
    <li className={classes.item}>
      <Card>
        <header>
          <h3>{title}</h3>
          <div className={classes.price}>${price.toFixed(2)}</div>
        </header>
        <p>{description}</p>
        <div className={classes.actions}>
          <button onClick={addToCartHandler}>Add to Cart</button>
        </div>
      </Card>
    </li>
  );
};

export default ProductItem;
