import { useRef, useState } from 'react';
import classes from './Checkout.module.css';

// helper functions outside of component -> for input validation
const notEmpty = (value) => !!value.trim();
const fiveChars = (value) => value.trim().length === 5;

const Checkout = ({ onSubmit, onCancel }) => {
  const [formValidity, setFormValidity] = useState({
    name: true,
    street: true,
    city: true,
    postal: true,
  }); // set to true at the beginning; for better solution with touched state look at react form repo

  const nameRef = useRef();
  const streetRef = useRef();
  const postalRef = useRef();
  const cityRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();

    // using useRef to get values + simple validation
    // -> for better and more complexe state input handling look at react form repo
    const name = nameRef.current.value;
    const street = streetRef.current.value;
    const postal = postalRef.current.value;
    const city = cityRef.current.value;

    const nameValid = notEmpty(name);
    const streetValid = notEmpty(street);
    const postalValid = fiveChars(postal);
    const cityValid = notEmpty(city);

    setFormValidity({
      name: nameValid,
      street: streetValid,
      postal: postalValid,
      city: cityValid,
    });

    const formValid = nameValid && streetValid && postalValid && cityValid; // only if all true then formValid true
    if (!formValid) return;

    // Submit cart data -> pass via prop fn to parent component
    onSubmit({
      name,
      street,
      postal,
      city,
    });
  };

  // here code duplication -> could build input components
  const controlClasses = (formInputField) => {
    return `${classes.control} ${formValidity[formInputField] ? '' : classes.invalid}`;
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={controlClasses('name')}>
        <label htmlFor='name'>Name</label>
        <input ref={nameRef} type='text' id='name' name='name' />
        {!formValidity.name && <p>Please enter valid name</p>}
      </div>
      <div className={controlClasses('street')}>
        <label htmlFor='street'>Street</label>
        <input ref={streetRef} type='text' id='street' name='street' />
        {!formValidity.street && <p>Please enter valid street</p>}
      </div>
      <div className={controlClasses('postal')}>
        <label htmlFor='postal'>Postal Code</label>
        {/* postal code is type text to be able to start with 0 */}
        <input ref={postalRef} type='text' id='postal' name='postal' />
        {!formValidity.postal && <p>Please enter valid postal code (5 characters)</p>}
      </div>
      <div className={controlClasses('city')}>
        <label htmlFor='city'>City</label>
        <input ref={cityRef} type='text' id='city' name='city' />
        {!formValidity.city && <p>Please enter valid city</p>}
      </div>
      <div className={classes.actions}>
        {/* IMPORTANT: type 'button' -> then it doesn't trigger submit */}
        <button type='button' onClick={onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
