import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // simple approach with useRef -> for more complex state handling with useState (onBlur, onChange ...) look into other lecture
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

export default AuthForm;
