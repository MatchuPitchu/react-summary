import { useState } from 'react';

import Button from '../../UI/Button/Button';
import styles from './CourseInput.module.css';

// commented out because of using CSS Modules
// import styled from 'styled-components';

// use case for styled components to apply styles for certain div only in this component;
// use "&" to indicate main HTML class (e.g. for pseudo-classes, nested selectors "& input {}" ...)
// const FormControl = styled.div`
//   margin: 0.5rem 0;

//   & label {
//     font-weight: bold;
//     display: block;
//     margin-bottom: 0.5rem;
//     color: ${(props) => (props.invalid ? 'red' : 'black')};
//   }

//   & input {
//     display: block;
//     width: 100%;
//     border: 1px solid ${(props) => (props.invalid ? 'red' : '#ccc')};
//     background: ${(props) => (props.invalid ? '#ffd7d7' : 'transparent')};
//     font: inherit;
//     line-height: 1.5rem;
//     padding: 0 0.25rem;
//   }

//   & input:focus {
//     outline: none;
//     background: #fad0ec;
//     border-color: #8b005d;
//   }
// `;

const CourseInput = ({ onAddGoal }) => {
  const [enteredValue, setEnteredValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  const goalInputChangeHandler = ({ target }) => {
    if (target.value.trim().length > 0) {
      setIsValid(true);
    }
    setEnteredValue(target.value);
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    // only add goal if input is NOT empty; use trim() to remove whitespaces from input;
    // setIsValid to render conditionally info to user that input was invalid
    if (enteredValue.trim().length === 0) {
      setIsValid(false);
      return;
    }
    onAddGoal(enteredValue);
  };

  return (
    <form onSubmit={formSubmitHandler}>
      {/* Adding conditional classes with CSS Modules */}
      <div
        className={`${styles['form-control']} ${!isValid && styles.invalid} `}
      >
        {/* inline styles have the highest priority, so they overwrite all other css rules; 
          therefore it's not recommanded, better way is setting classes dynamically with template literal (``) */}
        {/* <label style={{ color: !isValid ? 'red' : 'black' }}>Course Goal</label> */}
        <label>Course Goal</label>
        <input type='text' onChange={goalInputChangeHandler} />
      </div>
      <Button type='submit'>Add Goal</Button>
    </form>
  );

  // return (
  //   <form onSubmit={formSubmitHandler}>
  //     {/* Instead of div wrapper below, use case for defined FormControl styling; to add classes conditionally,
  //         solution 1) <FormControl className={!isValid && 'invalid'}>
  //         solution 2) look below - use props on component and feed it with boolean !isValid (-> true or false);
  //         between backticks above, set conditionally css rules
  //     */}
  //     <FormControl invalid={!isValid}>
  //       <label>Course Goal</label>
  //       <input type='text' onChange={goalInputChangeHandler} />
  //     </FormControl>
  //     <Button type='submit'>Add Goal</Button>
  //   </form>
  // );
};

export default CourseInput;
