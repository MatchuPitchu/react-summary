import { useRef, useState } from 'react';
// import { Prompt } from 'react-router-dom';

import Card from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';
import classes from './QuoteForm.module.css';

const QuoteForm = ({ onAddQuote, isLoading }) => {
  const [isEntering, setIsEntering] = useState(false);

  const authorInputRef = useRef();
  const textInputRef = useRef();

  const submitFormHandler = (e) => {
    e.preventDefault();

    const enteredAuthor = authorInputRef.current.value;
    const enteredText = textInputRef.current.value;

    // optional: data validation here

    onAddQuote({ author: enteredAuthor, text: enteredText });
  };

  const formFocusedHandler = () => setIsEntering(true);
  const finishEnteringHandler = () => setIsEntering(false);

  return (
    <>
      {/* Prompt is currently not supported yet by React Router DOM v6 */}
      {/* Preventing possibly unwanted route transitions with Prompt component;
      takes 2 props: 1) when can be true or false and enables or disables component;
      2) message is anonymous fn with parameter of location obj and a msg string in fn body */}
      {/* <Prompt
        when={isEntering}
        message={(location) => `You want to leave ${location.pathname}? Entered data will be lost.`}
      /> */}
      <Card>
        <form onFocus={formFocusedHandler} className={classes.form} onSubmit={submitFormHandler}>
          {isLoading && (
            <div className={classes.loading}>
              <LoadingSpinner />
            </div>
          )}
          <div className={classes.control}>
            <label htmlFor='author'>Author</label>
            <input type='text' id='author' ref={authorInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='text'>Text</label>
            <textarea id='text' rows='5' ref={textInputRef} />
          </div>
          <div className={classes.actions}>
            <button onClick={finishEnteringHandler} className='btn'>
              Add Quote
            </button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default QuoteForm;
