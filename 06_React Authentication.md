# Authentication in React Apps

- authentication is needed if content should be protected (-> not accessible by everyone)
  - for user profiles
  - for API endpoints: stored data in a database should be locked for non-authenticated users
- process of authentication:

  1. send request with user credentials
  1. server verifies credentials -> grants or denies access/permission,
  1. server sends NOT only "yes" or "no" back to client, since somebody could send fake "yes" to server to request protected data
  1. two approaches:

     - server-side sessions:
       - server stores unique identifier and sends same identifier to specific client
       - client sends identifier along with requests to protected resources
       - disadvantage: when you have SPA and backend served on different places or when backend API needs to stay flexible (e.g. like Google Maps API), then you don't want to store same identifier on the server -> `server should be stateless`, that's why tokens are then better
     - authentication tokens:

       - user sends credentials (e.g. mail, password) to server that compares data with database
       - if valide, server creates (but NOT stores) permission token (-> long `string` with encoded data that can be also decoded back into individual pieces of data)
       - tokens are typically created in [`JSON Web Token` (JWT)]('https://jwt.io/') Format: data is hashed into token with help of private key, only known by server
       - server sends token to client
       - client sends token along with requests to protected resources

       ![](00_slides/01_JWT.PNG)

## Practice example with Firebase

[Firebase Auth-REST-API]('https://firebase.google.com/docs/reference/rest/auth')

- create project -> go to `Authentication` -> click on `Los geht's` -> choose `Sign-in method` `Email/Password` -> go to `Users` where you can add manually new users
- Firebase API key: click on gear icon beside `Project Overview` -> go to `Project settings`

### Authentication Example code

- create authentication context to store states inside -> with auth persistence & auto-logout

  ```JavaScript
  // AuthContext.js
  import { createContext, useState, useEffect, useCallback } from 'react';
  // globally available variable in this file
  let logoutTimer;

  // use React Context to store user authentication information
  const AuthContext = createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {},
  });

  export const AuthContextProvider = ({ children }) => {
    // first search if token is stored in browser; returns either undefined or token string
    // DON'T need useEffect since localStorage is a synchronous API (-> otherwise useEffect would be necessary)
    const initialToken = localStorage.getItem('token');
    const [token, setToken] = useState(initialToken);

    const isLoggedIn = !!token; // converts truthy or falsy value to boolean true or false

    const logout = useCallback(() => {
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      clearTimeout(logoutTimer); // clear timer always when user logs out
    }, []);

    const login = useCallback(
      (token, expirationDate) => {
        // Browser built-in API to get access to browser storage;
        // only able to store primive values (-> use JSON.stringify(object/array) to be able to store this data too);
        // store a key value pair
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate);
        // after user logs in, automatically logout is set with calculation of remaining valid token time;
        // Date.now() returns current timestamp in ms
        logoutTimer = setTimeout(logout, expirationDate - Date.now());
        setToken(token);
      },
      [logout]
    );

    useEffect(() => {
      if (token) {
        let timeLeft = localStorage.getItem('expirationDate') - Date.now();
        // if useEffect is executed AND left time is below certain threshold then user is automatically logged out
        if (timeLeft < 6000) logout();
        else logoutTimer = setTimeout(logout, timeLeft);
        console.log('time left', timeLeft);
      }
    }, [token, logout]);

    const contextValues = {
      token,
      isLoggedIn,
      login,
      logout,
    };

    return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>;
  };
  ```

- implementing user authentication: Create Account and Login

  ```JavaScript
  // AuthForm.js
  import { useState, useRef, useContext } from 'react';
  import { useNavigate } from 'react-router-dom';
  import AuthContext from '../../context/AuthContext';
  import classes from './AuthForm.module.css';

  const AuthForm = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    // simple approach with useRef -> for more complex state handling with useState (onBlur, onChange ...) look into other lecture
    const emailRef = useRef();
    const passwordRef = useRef();

    const switchAuthModeHandler = () => setIsLogin((prevState) => !prevState);

    const submitHandler = async (e) => {
      e.preventDefault();
      try {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        // optional: add validation -> look into other lecture

        setLoading(true);

        // use helper variable for both POST requests: signup + signin
        let url;
        // set 2 different requests based on users current mode (login or not)
        if (isLogin) {
          url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;
        } else {
          url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;
        }
        // POST requests according to Firebase API Docu https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
        const options = {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
          headers: { 'Content-Type': 'application/json' },
        };

        const res = await fetch(url, options);
        const data = await res.json();
        // set loading to false after receiving response of server
        setLoading(false);
        if (!res.ok) {
          // if error message not available, then use generic message;
          // better option: parse error msg for keywords and generate cleaner and comprehensive message for user;
          // NOTICE: not send back msg that email already exists (-> security issue that somebody could check if emails exists or not)
          const errMsg = data?.error?.message || 'Authentication failed';
          throw new Error(errMsg);
          // optional: show an error modal with error message
        }
        // pass timestamp of the expiration date!!! (the number of ms since January 1, 1970);
        // transform string (-> data.expiresIn which contains expiration time in seconds) in number with +
        login(data.idToken, Date.now() + +data.expiresIn * 1000);
        navigate('/', { replace: true });
      } catch (error) {
        alert(error.message);
      }
    };

    return (
      <section className={classes.auth}>
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor='email'>Your Email</label>
            <input type='email' id='email' required ref={emailRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='password'>Your Password</label>
            <input type='password' id='password' required ref={passwordRef} />
          </div>
          <div className={classes.actions}>
            {!loading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
            {loading && <p>Sending request...</p>}
            <button type='button' className={classes.toggle} onClick={switchAuthModeHandler}>
              {isLogin ? 'Create new account' : 'Login with existing account'}
            </button>
          </div>
        </form>
      </section>
    );
  };
  ```

- protect routes conditionally and redirect user on starting page if he types in a non existing path

  ```JavaScript
  // App.js
  const App = () => {
    const { isLoggedIn } = useContext(AuthContext);

    return (
      <Routes>
        <Route path='/' element={<HomePage />} />
        {!isLoggedIn && <Route path='/auth' element={<AuthPage />} />}
        <Route
          path='/profile'
          element={isLoggedIn ? <UserProfile /> : <Navigate replace to='/' />}
        />
        <Route path='*' element={<Navigate replace to='/' />} />
      </Routes>
    );
  };
  ```
