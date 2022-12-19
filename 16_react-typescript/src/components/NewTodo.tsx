import React, { useRef, useContext } from 'react';
import { TodosContext } from '../store/Context';
import classes from './NewTodo.module.css';

// 1) with passing props
// const NewTodo: React.FC<{ onAddTodo: (text: string) => void }> = ({ onAddTodo }) => {

// 2) with Context
const NewTodo: React.FC = () => {
  const { addTodo } = useContext(TodosContext);

  // define kind of data that ref will store, that means which input element will be connected to ref;
  // <HTMLInputElement> is built-in type like they are available for all DOM elements;
  // to find type name, search "mdn [DOM element]" and have a look at "DOM interface"
  const inputRef = useRef<HTMLInputElement>(null);

  // special type for form submission event;
  // MouseEvent = in case of onClick event
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    // current? not necessary here, because submit fn is only executed when ref has a value;
    // hypothically if element would not exist then value of enteredText would be undefined;
    // use ! if you are sure that current can't be null here
    const enteredText = inputRef.current!.value;

    if (enteredText.trim().length === 0) {
      // throw error
      return;
    }

    addTodo(enteredText);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {/* htmlFor establishes connection with content with the same id */}
      <label htmlFor='text'>Todo text</label>
      <input type='text' id='text' ref={inputRef} />
      <button>Add Todo</button>
    </form>
  );
};

export default NewTodo;
