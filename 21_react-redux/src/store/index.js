// import { createStore } from 'redux';
// simplify redux using with createSlice (recommended) or createReducer fn;
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter';
import authReducer from './auth';

// 2) Reducer with React Redux and without Redux Toolkit
// reducer function
// with TypeScript: good approach to use general Enums for action types
// const reducerFn = (state = initialState, action) => {
//   if (action.type === 'increment') {
//     // Redux replaces existing state, NOT merges new state into prev state
//     return { counter: state.counter + 1, showCounter: state.showCounter };
//   }

//   if (action.type === 'decrement') {
//     return { counter: state.counter - 1, showCounter: state.showCounter };
//   }

//   if (action.type === 'increase') {
//     return { counter: state.counter + action.value, showCounter: state.showCounter };
//   }

//   if (action.type === 'toggle') {
//     return { counter: state.counter, showCounter: !state.showCounter };
//   }

//   return state;
// };

// for 2) create store and point at reducer fn
// const store = createStore(reducerFn);

// for 1) configureStore creates store like createStore of Redux,
// but can merge multiple reducers into one reducer;
// pass in a configuration obj with "reducer" prop that can have obj of
// different key reducer pairs of your choice to include multiple reducers;
// if you have only one reducer, then you don't need this obj
// attention: you point at "reducer", even if you write "reducers" in createSlice()
const store = configureStore({
  // reducer: counterSlice.reducer,
  reducer: {
    counter: counterReducer,
    auth: authReducer,
  },
});

export default store;
