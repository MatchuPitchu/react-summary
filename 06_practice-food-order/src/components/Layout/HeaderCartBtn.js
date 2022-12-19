import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../store/CartContext'; // you need CartContext obj here, NOT import the Provider

import CartIcon from '../Cart/CartIcon';
import classes from './HeaderCartBtn.module.css';

const HeaderCartBtn = ({ onClick }) => {
  // with useContext Hook, component will be reevaluate when context changes
  const { items } = useContext(CartContext);
  const [btnBump, setBtnBump] = useState(false);

  // reduce()-Methode reduziert Array auf einzigen Wert, indem es jeweils 2 Elemente
  // (von links nach rechts) durch eine gegebene Funktion reduziert
  // in reduce method: curNum is initialy 0 as defined as second argument
  const numOfCartItems = items.reduce((curNum, item) => {
    return curNum + item.amount;
  }, 0);

  const btnClasses = `${classes.button} ${btnBump ? classes.bump : ''}`;

  // useEffect to add bump class for certain time after adding new item;
  // useEffect executes when items arr in CartContext changes
  useEffect(() => {
    // only execute if user has at least one item in the cart
    if (items.length === 0) return;
    setBtnBump(true);
    // remove bump class after 300ms
    const timerId = setTimeout(() => setBtnBump(false), 300);
    // clear timer: cleanup function executes BEFORE useEffect runs text time OR BEFORE component is removed from the DOM
    return () => clearTimeout(timerId);
  }, [items]);

  return (
    <button className={btnClasses} onClick={onClick}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>Your Cart</span>
      <span className={classes.badge}>{numOfCartItems}</span>
    </button>
  );
};

export default HeaderCartBtn;
