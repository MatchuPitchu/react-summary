# Redux - Managing App-Wide State

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

### Basic Example of Redux in React

- create Store in own directory: `store/index.js`

```JavaScript
// store/index.js
import { createStore } from 'redux';

// reducer function
const reducerFn = (state = { counter: 0 }, action) => {
  if (action.type === 'increment') return { counter: state.counter + 1 };
  if (action.type === 'decrement') return { counter: state.counter - 1 };
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
  - `useStore`: select whole store
- retrieve dispatch function with help of `useDispatch` hook

```JavaScript
// components/Counter.js
import { useSelector, useDispatch } from 'react-redux';
import classes from './Counter.module.css';

const Counter = () => {
  // hook returns dispatch fn for Redux store
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter);

  // dispatch action types
  const incrementHandler = () => dispatch({ type: 'increment' });
  const decrementHandler = () => dispatch({ type: 'decrement' });

  return (
    <main>
      <div>Value: {counter}</div>
      <div>
        <button onClick={incrementHandler}>Increment</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
    </main>
  );
};
```
