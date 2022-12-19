import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <header className={classes.header}>
      <NavLink to='/'>
        <div className={classes.logo}>React Auth</div>
      </NavLink>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <NavLink to='/auth'>Login</NavLink>
            </li>
          )}
          {isLoggedIn && (
            <>
              <li>
                <NavLink to='/profile'>Profile</NavLink>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
