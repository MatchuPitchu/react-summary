import { NavLink, Link } from 'react-router-dom';
import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  return (
    <header className={classes.header}>
      <Link className={classes.logo} to='/'>
        Great Quotes
      </Link>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink className={(navData) => (navData.isActive ? classes.active : '')} to='/quotes'>
              All Quotes
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? classes.active : '')}
              to='/new-quote'
            >
              Add a Quote
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
