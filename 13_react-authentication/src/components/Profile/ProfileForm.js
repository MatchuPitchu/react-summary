import { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const { token, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const enteredNewPassword = passwordRef.current.value;
      // add validation
      setLoading(true);
      const options = {
        method: 'POST',
        body: JSON.stringify({
          idToken: token,
          password: enteredNewPassword,
          returnSecureToken: true,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
        options
      );
      console.log(res);
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        const errMsg = data?.error?.message || 'Reset password failed';
        throw new Error(errMsg);
        // optional: show an error modal with error message
      }
      login(data.idToken); // pass new token
      navigate('/', { replace: true }); // or stay on page and display success message
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={passwordRef} />
      </div>
      <div className={classes.action}>
        {!loading && <button>Change Password</button>}
        {loading && <p>Sending...</p>}
      </div>
    </form>
  );
};

export default ProfileForm;
