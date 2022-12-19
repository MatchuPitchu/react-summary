import { createSlice } from '@reduxjs/toolkit';

const initialCounterState = { counter: 0, showCounter: true };

// 1) State slice with Reducer fn with Redux Toolkit
// with this fn you can create different slices of the global state to make code more maintainable
const counterSlice = createSlice({
  name: 'counter',
  initialState: initialCounterState,
  // include all reducers methods this slice needs;
  // all methods could have 2 parameters: state, action;
  // a) with this methods, you can dispatch actions without using if statements like in reducer fn bellow
  // in fn body, you are allowed to mutate the state (normally NEVER DO IT) because Redux Toolkit
  // uses iternally "Immer" that detects when state should be mutated and clones existing state,
  // keeps all the state that you are not editing and overwrites desired piece of state in an immutable way;
  // b) createSlice creates "action creator" methods for you that return unique action identifiers for different reducers
  // (e.g. when you call later counterSlice.actions.yourReducerName() Redux Toolkit returns an action obj
  // of this shape: { type: 'some unique identifier' })
  reducers: {
    increment: (state) => {
      state.counter++;
    },
    decrement: (state) => {
      state.counter--;
    },
    increase: (state, action) => {
      state.counter = state.counter + action.payload; // payload is fixed property name of Redux Toolkit
    },
    toggleCounter: (state) => {
      state.showCounter = !state.showCounter;
    },
  },
});

// export action dispatchers that you can use it in other components to update the state
export const counterActions = counterSlice.actions;

// if you only need reducer, then export only this
export default counterSlice.reducer;
