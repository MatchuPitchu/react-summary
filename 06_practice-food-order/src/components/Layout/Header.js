import { Fragment } from 'react';
import HeaderCartBtn from './HeaderCartBtn';
import classes from './Header.module.css';
// have to import image saved in assets folder
import mealsImg from '../../assets/meals.jpg';

const Header = ({ onShowCart }) => {
  return (
    <Fragment>
      <header className={classes.header}>
        <h1>ReactFood</h1>
        <HeaderCartBtn onClick={onShowCart} />
      </header>
      <div className={classes['main-image']}>
        <img src={mealsImg} alt='A table full of food' />
      </div>
    </Fragment>
  );
};

export default Header;
