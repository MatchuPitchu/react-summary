import { useRef, useState } from 'react';
import Input from '../../UI/Input';
import classes from './MealItemForm.module.css';

// context NOT used here because in this component only entered amount as user input is available
const MealItemForm = ({ id, onAddToCart }) => {
  const [amountValid, setAmountValid] = useState(true);
  const amountInputRef = useRef();

  const submitHandler = e => {
    e.preventDefault();
    // value is always string even if input type is number, remove empty spaces and convert to num with +
    const enteredAmount = +amountInputRef.current.value.trim();
    // input validation check
    if (enteredAmount < 1 || enteredAmount > 5) {
      setAmountValid(false);
      return;
    }
    onAddToCart(enteredAmount);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <Input
        ref={amountInputRef} // forwardRef in Input component needed to make ref work
        label='Amount'
        input={{
          id: `amount_${id}`,
          type: 'number',
          min: '1',
          max: '5',
          step: '1',
          defaultValue: '1',
        }}
      />
      <button type='submit'>+ Add</button>
      {!amountValid && <p>Please enter a valid amount (1-5)</p>}
    </form>
  );
};

export default MealItemForm;
