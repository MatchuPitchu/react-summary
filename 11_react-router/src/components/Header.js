import { NavLink } from 'react-router-dom';
import classes from './Header.module.css';

const Header = () => {
  return (
    <header className={classes.header}>
      <nav>
        <ul>
          <li>
            {/* Link component allows to change path without refreshing whole page */}
            {/* NavLink sets css class on active anchor item that you can style active link differently */}
            <NavLink activeClassName={classes.active} to='/welcome'>
              Welcome
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to='/products'>
              Products
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
