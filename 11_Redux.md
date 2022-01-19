# Redux - Managing App-Wide State

> Redux General for JavaScript: <https://redux.js.org/>
> Redux React Package <https://react-redux.js.org/>
> Redux Toolkit to simplify Redux in React <https://redux-toolkit.js.org/>

## What is Redux?

- state management system for cross-componment or app-wide state (like `React Context`)
- `local state`: belongs to a single component (-> should be managed internal of component wie `useState` or `useReducer` hooks)
- `cross-component state`: affects multiple components (-> requires `prop chains`/`prop drilling` OR `Context` or `Redux`)
- `app-wide state`: affects entire app (most or all components) (-> requires `prop chains`/`prop drilling` OR `Context` or `Redux`)

## Redux vs React Context

- in more complex apps, managing `Context` can lead to deeply nested JSX code or huge `Context Provider` components

  ```JSX
  // 1) if you want to separate concerns, then you could have deeply nested context components
  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <UIInteractionContextProvider>
          <MultiStepFormContextProvider>
            <UserRegistration />
          </MultiStepFormContextProvider>
        </UIInteractionContextProvider>
      </ThemeContextProvider>
    </AuthContextProvider>
  )
  ```

  ```JavaScript
  // 2) if you collect all different concerns in one file, becomes difficult to manage and maintain
  const AllContextProvider = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [isEvaluatingAuth, setIsEvaluatingAuth] = useState(false);
    const [activeTheme, setActiveTheme] = useState('default');
    // ...

    const loginHandler = (email, password) => { ... };
    const signupHandler = (email, password) => { ... };
    const changeThemeHandler = (newTheme) => { ... };
    // ...

    return <AllContext.Provider></AllContext.Provider>
  }
  ```

- performance: `Context` is not optimized for high-frequency state changes

## Core Concepts Redux

- one `Central Data (State) Store` (never more than one) for entire app
- components set up `Subscriptions` to store and whenever data changes, store notifies components and they get the needed slice of data
- components NEVER manipulate directly the store data
- `Reducer Function` is responsible for mutating store data
  - components dispatch or trigger `Actions` (-> is an object which describes the kind of operation the reducer should perform)
  - `Action` is forwarded to Reducer Fn which reads the description and performs desired operation
- `npm i redux` -> redux is independent of React, can be used in every JS application
- `npm i react-redux` -> allows connection between React App and Redux Store

### Basic Example of Redux without React

```JavaScript
import redux from 'redux';

// reducer function:
// will be called by redux library;
// receives 2 args: a) old state, b) dispatched action;
// must return new state object (-> theoretically can be any type of data);
// when store is initilized, redux executes reducer for first time -> so need to set default state value
const counterReducer = (state = { counter: 0 }, action) => {
  if (action.type === 'increment') return { counter: state.counter + 1 };
  if (action.type === 'decrement') return { counter: state.counter - 1 };
  return state;
};

// create redux store
// point at reducer fn to declare which reducer is reponsible for state changes;
const store = redux.createStore(counterReducer);

// subscription to store
const counterSubscriber = () => {
  // getState is available in store obj -> gives latest state snapshot AFTER update with store.dispatch()
  const latestState = store.getState();
  console.log(latestState);
};

// connect subscription fn to redux store;
// redux executes this function whenever in store data changed
store.subscribe(counterSubscriber);

// dispatch action obj: includes type property with unique string;
store.dispatch({ type: 'increment' }); // console.log result -> { counter: 1}
store.dispatch({ type: 'decrement' }); // console.log result -> { counter: 0}
```

### Basic Example of Redux in React but without Redux Toolkit

- create Store with multiple states in own directory: `store/index.js`
- `states`: Redux replaces (-> overwrites) existing state, NOT merges new state into prev state
  - NEVER mutate existing state (in example below, it's the `state` parameter), because objects and arrays are `reference values` in JavaScript, that could cause big unintended problems
    - Important: `immutable update patterns` <https://redux.js.org/usage/structuring-reducers/immutable-update-patterns#immutable-update-patterns>
- `action types`: with TypeScript, it's a good approach to use general `Enums`

```JavaScript
// store/index.js
import { createStore } from 'redux';

const initialState = { counter: 0, show: true }

// reducer function
const reducerFn = (state = initialState, action) => {
  if (action.type === 'increase') {
    return { counter: state.counter + action.value, show: state.show };
  }

  if (action.type === 'decrement') {
    return { counter: state.counter - 1, show: state.show };
  }

  if (action.type === 'toggle') {
    return { counter: state.counter, show: !state.show };
  }

  return state;
};
// create store and point at reducer fn
const store = createStore(reducerFn);

export default store;
```

- wrap wished components in `React Redux Provider` (like for `React Context`)
  - wrapped components with all there childs now have access to redux
- connect Provider with your specific redux store

```JavaScript
// index.js
import { Provider } from 'react-redux';
import store from './store/index';
// ...

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

- use hooks to access Redux store:
  - `useSelector(state => state.pieceOfState)`: you can select a part of state managed by store
    - pass in an anonymous fn that determines which piece of state you want to extract from store;
    - with useSelector, `subscription` is automatically set up to the store for this component;
    - if component will be unmounted, subscription is also cleared automatically
    - if state changes, new state is returned automatically and leads to re-evaluation of component
  - `useStore`: select whole store
- retrieve dispatch function with help of `useDispatch` hook
  - dispatch fn receives action object that can contain an action type property and a payload property

```JavaScript
// components/Counter.js
import { useSelector, useDispatch } from 'react-redux';

const Counter = () => {
  // hook returns dispatch fn for Redux store
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter);
  const show = useSelector((state) => state.show);

  // dispatch action types with and without payload
  const increaseHandler = () => dispatch({ type: 'increase', value: 5 });
  const decrementHandler = () => dispatch({ type: 'decrement' });

  const toggleHandler = () => dispatch({ type: 'toggle' });

  return (
    <main>
      {show && <div>Value: {counter}</div>}
      <div>
        <button onClick={increaseHandler}>Increase by 5</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
      <button onClick={toggleHandler}>Toggle</button>
    </main>
  );
};
```

## Redux Toolkit to simplify Redux with React

- `npm i @reduxjs/toolkit` (-> includes Redux, so you can remove this from your `package.json`)
- `createSlice({ name: '...', initialState: ..., reducers: { ... } })`: with this fn you can create different slices of the global state to make code more maintainable
  - `reducers` key includes all reducers methods this slice needs;
    - all methods could have 2 parameters: `state`, `action`;
    - a) with this methods, you can dispatch actions without using if statements like in a "normal" reducer fn
      - in fn body, you are allowed to mutate the state (-> normally NEVER DO IT) because Redux Toolkit
      - uses iternally `Immer` that detects when state should be mutated and clones existing state, keeps all the state that you are not editing and overwrites desired piece of state in an immutable way;
    - b) `createSlice` creates `action creator methods` for you that return `unique action identifiers` for different reducers
      - e.g. when you call later `counterSlice.actions.yourReducerName()`, Redux Toolkit returns an action obj of this shape: `{ type: 'some unique identifier' }`
- `configureStore({ reducer: ... })` creates store like `createStore` of basic Redux, but can merge multiple reducers into one reducer;
  - pass in a `configuration obj` with `reducer prop` that can have obj of different `key reducer pairs` of your choice to include multiple reducers
  - if you have only one reducer, then you don't need this obj (-> `reducer: counterSlice.reducer` would be enough)
  - attention: you point at `reducer`, even if you write `reducers` in createSlice()

### Basic Example of Redux in React with Redux Toolkit and multiple slices of global state

```JavaScript
// store/index.js

// simplify redux using with createSlice (recommended) or createReducer fn;
import { createSlice, configureStore } from '@reduxjs/toolkit';

// First slice of global state
const initialState = { counter: 0, showCounter: true };

const counterSlice = createSlice({
  name: 'counter',
  initialState,
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

// Second slice of global state
const initialAutchState = { isAuth: false };

const authSlice = createSlice({
  name: 'authentification',
  initialState: initialAutchState,
  reducers: {
    login: (state) => {
      state.isAuth = true;
    },
    logout: (state) => {
      state.isAuth = false;
    },
  },
});

const store = configureStore({
  // reducer: counterSlice.reducer,
  reducer: {
    counter: counterSlice.reducer,
    auth: authSlice.reducer,
  },
});

export const counterActions = counterSlice.actions;
export const authActions = authSlice.actions;

export default store;
```

- dispatch action with `payload` with Redux Toolkit: payload is passed into reducer fn with a simple argument that is converter by Redux Toolkit to a `payload property`

```JavaScript
// components/Counter.js
import { useSelector, useDispatch } from 'react-redux';
import { counterActions } from '../store/index';

const Counter = () => {
  // hook returns dispatch fn for Redux store
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter);
  const show = useSelector((state) => state.show);

  // dispatch action types with and without payload with Redux Toolkit
  const incrementHandler = () => dispatch(counterActions.increment());
  const decrementHandler = () => dispatch(counterActions.decrement());
  const increaseHandler = () => dispatch(counterActions.increase(5)); // { type: SOME_UNIQUE_IDENTIFIER, payload: 5 }
  const toggleCounterHandler = () => dispatch(counterActions.toggleCounter());

  return (
    <main>
      {show && <div>Value: {counter}</div>}
      <div>
        <button onClick={increaseHandler}>Increase by 5</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
      <button onClick={toggleHandler}>Toggle</button>
    </main>
  );
};
```

```JavaScript
// components/Auth.js
import { useDispatch } from 'react-redux';
import { authActions } from '../store/index';

const Auth = () => {
  const dispatch = useDispatch();

  const loginHandler = (e) => {
    e.preventDefault();
    // input validation ...
    dispatch(authActions.login());
  };

  return (
    <main>
      <section>
        <form onSubmit={loginHandler}>
          <div>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' />
          </div>
          <button>Login</button>
        </form>
      </section>
    </main>
  );
};
```
