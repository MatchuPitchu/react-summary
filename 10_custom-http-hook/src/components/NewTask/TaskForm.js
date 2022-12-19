import { useRef } from 'react';
import classes from './TaskForm.module.css';

const TaskForm = ({ onEnterTask, loading }) => {
  const taskInputRef = useRef();

  const submitHandler = e => {
    e.preventDefault();
    const enteredValue = taskInputRef.current.value;
    if (enteredValue.trim().length > 0) onEnterTask(enteredValue);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <input type='text' ref={taskInputRef} />
      <button>{loading ? 'Sending...' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;
