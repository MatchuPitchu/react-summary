import { useContext } from 'react';
import { CartContext } from '../../../store/CartContext';
import MealItemForm from './MealItemForm';
import classes from './MealItem.module.css';

const MealItem = ({ name, description, price, id }) => {
  const { addItem } = useContext(CartContext);

  // format passed prop price (with alias p)
  const p = `${price.toFixed(2)} €`;

  const addToCartHandler = amount => {
    // create new item and add it to cart state items array
    addItem({
      id,
      name,
      description,
      price, // add price as number, NOT formatted as const p with €
      amount,
    });
  };

  return (
    // use li element because it's rendered in a ul
    <li className={classes.meal}>
      <div>
        <h3>{name}</h3>
        <div className={classes.description}>{description}</div>
        <div className={classes.price}>{p}</div>
      </div>
      <div>
        <MealItemForm id={id} onAddToCart={addToCartHandler} />
      </div>
    </li>
  );
};

export default MealItem;
