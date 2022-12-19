// reusable input component
import { useRef, forwardRef, useImperativeHandle } from 'react';

import classes from './Input.module.css';

// beside props there is a second rarely used available parameter 'ref'
// for the case that a ref is set for this component from outside (-> look at parent component);
// to make it possible that a ref is passed to this component, wrap component into React.forwardRef method;
// forwardRef returns a React component that is capable of being bound to a ref
const Input = forwardRef(
  ({ isValid, id, label, type, value, onChange, onBlur }, ref) => {
    const inputRef = useRef();

    const focus = () => {
      // available on input DOM obj when you're using ref in same component
      inputRef.current.focus();
    };

    // in parent component you can only use things of the ref that are exposed
    // in return of useImperativeHandle Hook;
    // first argument is ref from outside (from parent component)
    // second argument anonymous callback fn
    useImperativeHandle(ref, () => {
      // return a translation obj with all data that you would use from outside
      return {
        // define externally available name (-> here 'focus') that points to focus fn
        focus: focus,
      };
    });

    return (
      <div
        className={`${classes.control} ${
          isValid === false ? classes.invalid : ''
        }`}
      >
        <label htmlFor={id}>{label}</label>
        <input
          ref={inputRef}
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          // onBlur is activated when input loses focus
          onBlur={onBlur}
        />
      </div>
    );
  }
);

export default Input;
