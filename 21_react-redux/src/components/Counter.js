// specific hooks to access redux store
// useSelector: you can select a part of state managed by store
// useStore: select whole store
import { useSelector, useDispatch } from 'react-redux';
import { counterActions } from '../store/counter';
import classes from './Counter.module.css';

const Counter = () => {
  // hook returns the dispatch function for Redux store
  const dispatch = useDispatch();
  // pass in an anonymous fn that determines which piece of state you want to extract from store;
  // with useSelector, subscription is automatically set up to the store for this component;
  // if component will be unmounted, subscription is also cleared automatically;
  // if state changes, new state is returned automatically and leads to re-evaluation of component
  // 1) One state slice or only one global state
  // const counter = useSelector((state) => state.counter);
  // const show = useSelector((state) => state.showCounter);

  // 2) Redux Toolkit: if you have multiple state slices, use defined key to access specific slice state
  const counter = useSelector((state) => state.counter.counter);
  const show = useSelector((state) => state.counter.showCounter);

  // dispatch action types
  // const incrementHandler = () => dispatch({ type: 'increment' });
  // const decrementHandler = () => dispatch({ type: 'decrement' });
  // const increaseHandler = () => dispatch({ type: 'increase', value: 5 });
  // const toggleCounterHandler = () => dispatch({ type: 'toggle' });

  // with Redux Toolkit
  const incrementHandler = () => dispatch(counterActions.increment());
  const decrementHandler = () => dispatch(counterActions.decrement());
  const increaseHandler = () => {
    // payload is passed into reducer fn with a simple argument that is converter by Redux Toolkit to a payload property
    dispatch(counterActions.increase(5)); // { type: SOME_UNIQUE_IDENTIFIER, payload: 5 }
  };
  const toggleCounterHandler = () => dispatch(counterActions.toggleCounter());

  return (
    <main className={classes.counter}>
      <h1>Redux Counter</h1>
      {show && <div className={classes.value}>{counter}</div>}
      <div className={classes.btns}>
        <button onClick={incrementHandler}>Increment</button>
        <button onClick={increaseHandler}>Increment by 5</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
    </main>
  );
};

export default Counter;
