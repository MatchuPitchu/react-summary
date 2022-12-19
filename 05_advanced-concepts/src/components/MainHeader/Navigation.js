import { useContext } from 'react';

import AuthContext from '../../context/AuthContext';
import classes from './Navigation.module.css';

const Navigation = () => {
  // pass the pointer to the context obj into useContext
  // create variables with destructuring
  const { isLoggedIn, logoutHandler } = useContext(AuthContext);

  return (
    <nav className={classes.nav}>
      <ul>
        {isLoggedIn && (
          <li>
            <a href='/'>Users</a>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <a href='/'>Admin</a>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <button onClick={logoutHandler}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
