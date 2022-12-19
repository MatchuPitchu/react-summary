import { useState, useRef } from 'react';

import Card from '../UI/Card';
import Button from '../UI/Button';
import styles from './AddUser.module.css';
import ErrorModal from '../UI/ErrorModal';

const AddUser = ({ onAddUser }) => {
  // const [username, setUsername] = useState('');
  // const [age, setAge] = useState(''); // read input of form is always string
  const [err, setErr] = useState();

  // useRef: first time component is rendered, React sets value of nameRef and ageRef
  // to a real DOM element (-> NOT the virtual DOM of React, so should not manipulate it,
  // only React should) that is rendered based on the JSX element with ref attribute
  // and connection to the wished variable;
  // useful when you only want to read a value and never plan on changing anything,
  // then you don't need useState
  const nameRef = useRef();
  const ageRef = useRef();

  const submitUserData = (e) => {
    e.preventDefault();

    // 2) useRef way: use read values of ref DOM elements instead of states 'username' + 'age';
    // BUT here not a good use case, because inputs are now uncontrolled
    // (with useState and two way binding they would be controlled) components
    const enteredName = nameRef.current.value;
    const enteredAge = ageRef.current.value;

    // check if fields are empty
    if (enteredName.trim().length === 0 || enteredAge.trim().length === 0) {
      setErr({
        title: 'Invalid input',
        message: 'Please enter a valid name and age (non-empty values).',
      });
      return;
    }
    // check if age (-> converted to num with "+") is smaller than 1
    if (+enteredAge < 1) {
      setErr({
        title: 'Invalid age',
        message: 'Please enter a valid age (> 0).',
      });
      return;
    }

    // forward input data with function to parent component App.js
    onAddUser(enteredName, enteredAge);

    // reset input fields when using refs
    // normally DON'T manipulate real DOM, but here for resetting input fields it's admissible
    nameRef.current.value = '';
    ageRef.current.value = '';

    // reset input fields
    // setUsername('');
    // setAge('');
  };

  // const usernameChangeHandler = ({ target }) => setUsername(target.value);
  // const ageChangeHandler = ({ target }) => setAge(target.value);

  const errHandler = () => setErr(null); // null is falsy value

  return (
    <>
      {err && (
        <ErrorModal
          title={err.title}
          message={err.message}
          onConfirm={errHandler}
        />
      )}
      {/* Pass styles as props into Card component -> need to insert them
      correctly in Card component */}
      <Card className={styles.inputBox}>
        <form onSubmit={submitUserData}>
          {/* to connect label to input: "for" in label tag not allowed, instead use "htmlfor" */}
          <label htmlFor='username'>Username</label>
          <input
            id='username'
            type='text'
            // value={username}
            // onChange={usernameChangeHandler}
            // connect HTML element to a ref const created above with useRef hook
            ref={nameRef}
          />
          <label htmlFor='age'>Age (Years)</label>
          <input
            id='age'
            type='number'
            // value={age}
            // onChange={ageChangeHandler}
            ref={ageRef}
          />
          <Button type='submit'>Add User</Button>
        </form>
      </Card>
    </>
  );
};

export default AddUser;
