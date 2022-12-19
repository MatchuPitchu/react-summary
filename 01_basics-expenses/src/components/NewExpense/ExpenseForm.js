import { useState } from 'react';
import './ExpenseForm.css';

const ExpenseForm = ({ onSaveExpenseData, onCancel }) => {
  // when I read a value of an input it's always a string (so numbers and dates are also read as strings)
  const [userInput, setUserInput] = useState({
    title: '',
    amount: '',
    date: '',
  });

  const titleChangeHandler = ({ target }) => {
    // if new state depends on previous state, use anonymous arrow fn inside setState fn
    // and use previous state as a parameter;
    // React schedules state updates, therefore without this anonymous fn state update could be made with outdated state
    setUserInput((prev) => ({
      ...prev,
      title: target.value,
    }));
  };

  const amountChangeHandler = ({ target }) => {
    setUserInput((prev) => ({
      ...prev,
      amount: target.value,
    }));
  };

  const dateChangeHandler = ({ target }) => {
    setUserInput((prev) => ({
      ...prev,
      date: target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const submittedData = {
      ...userInput,
      date: new Date(userInput.date), // construct new Date obj to which I pass entered date string
    };
    // use fn that is passed as a prop into this component to pass data bottom-up (from child to parent component)
    onSaveExpenseData(submittedData);

    setUserInput({
      title: '',
      amount: '',
      date: '',
    });
  };

  return (
    <form onSubmit={submitHandler}>
      <div className='new-expense__controls'>
        <div className='new-expense__control'>
          <label>Title</label>
          <input
            type='text'
            // add value attribute here with state variable is called two-way binding
            value={userInput.title}
            onChange={titleChangeHandler}
          />
        </div>
        <div className='new-expense__control'>
          <label>Amount</label>
          <input
            type='number'
            min='0.01'
            step='0.01'
            value={userInput.amount}
            onChange={amountChangeHandler}
          />
        </div>
        <div className='new-expense__control'>
          <label>Date</label>
          <input
            type='date'
            min='2019-01-01'
            max='2022-12-31'
            value={userInput.date}
            onChange={dateChangeHandler}
          />
        </div>
      </div>
      <div className='new-expense__actions'>
        <button type='button' onClick={onCancel}>
          Cancel
        </button>
        <button type='submit'>Add Expense</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
