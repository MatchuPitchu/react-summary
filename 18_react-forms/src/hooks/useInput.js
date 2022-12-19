import { useState, useReducer } from 'react';

const initialInputState = {
  value: '',
  touched: false,
};

const inputReducer = (prevState, action) => {
  // DON'T set touched to true in 'INPUT' line since user is still typing
  if (action.type === 'INPUT') return { value: action.value, touched: prevState.touched };
  if (action.type === 'BLUR') return { value: prevState.value, touched: true };
  if (action.type === 'RESET') return { value: '', touched: false };
  return {
    value: '',
    touched: false,
  };
};

const useInput = (validateValue) => {
  // 2) Version 2: practice useReducer
  const [inputState, dispatch] = useReducer(inputReducer, initialInputState);

  const valueValid = validateValue(inputState.value); // receive fn via props that tells how to validate value
  const hasError = !valueValid && inputState.touched; // hasError only relevant for visual feedback for user

  const valueChangeHandler = ({ target }) => {
    dispatch({
      type: 'INPUT',
      value: target.value,
    });
  };
  const inputBlurHandler = (e) => {
    dispatch({ type: 'BLUR' });
  };

  const reset = () => dispatch({ type: 'RESET' });

  return {
    value: inputState.value,
    valueValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };

  // 1) Version 1: with useState
  // const [value, setValue] = useState('');
  // const [touched, setTouched] = useState(false); // controls if user touched already input field

  // const valueValid = validateValue(value); // receive fn via props that tells how to validate value
  // const hasError = !valueValid && touched; // hasError only relevant for visual feedback for user

  // const valueChangeHandler = ({ target }) => setValue(target.value);
  // const inputBlurHandler = (e) => setTouched(true);

  // const reset = () => {
  //   setValue('');
  //   setTouched(false);
  // };

  // return {
  //   value,
  //   valueValid,
  //   hasError,
  //   valueChangeHandler,
  //   inputBlurHandler,
  //   reset,
  // };
};

export default useInput;
