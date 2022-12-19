import { forwardRef } from 'react';
import classes from './Input.module.css';

// wrap component fn into React.forwardRef method to make refs
// inside of component accessible to parent component
const Input = forwardRef(({ label, input }, ref) => {
  return (
    <div className={classes.input}>
      {/* for in HTML is htmlFor in JSX */}
      <label htmlFor={input.id}>{label}</label>
      {/* use spread operator to spread all key value pairs in input obj; 
      then they're added as attributes to input element */}
      <input ref={ref} {...input} />
    </div>
  );
});

export default Input;
