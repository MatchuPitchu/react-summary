# Redux - Managing App-Wide State

> Redux General for JavaScript: <https://redux.js.org/>
> Redux React Package <https://react-redux.js.org/>
> Redux Toolkit to simplify Redux in React <https://redux-toolkit.js.org/>

## What is Redux?

- state management system for cross-componment or app-wide state (like `React Context`)
  - `local state`: belongs to a single component (-> should be managed internal of component wie `useState` or `useReducer` hooks)
  - `cross-component state`: affects multiple components (-> requires `prop chains`/`prop drilling` OR `Context` or `Redux`)
  - `app-wide state`: affects entire app (most or all components) (-> requires `prop chains`/`prop drilling` OR `Context` or `Redux`)
- Redux can replace `React Context`, but have in mind, with Redux you add a third-party library to the code of your application (which becomes bigger)

## Redux vs React Context

- in more complex apps, managing `Context` can lead to deeply nested JSX code or huge `Context Provider` components

  ```jsx
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
  );
  ```

  ```javascript
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

- performance: `Context` is not optimized for high-frequency state changes, that means, every (!) component that uses `useContext()` will re-render when a state changes in the `Context`

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

```javascript
import redux from 'redux';

// reducer function:
// will be called by redux library;
// receives 2 args: a) old state, b) dispatched action;
// must return new state object (-> theoretically can be any type of data);
// when store is initialized, redux executes reducer for first time -> so need to set default state value
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

```javascript
// store/index.js
import { createStore } from 'redux';

const initialState = { counter: 0, show: true };

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
export const store = createStore(reducerFn);
```

- wrap wished components in `React Redux Provider` (like for `React Context`)
  - wrapped components with all there childs now have access to redux
- connect Provider with your specific redux store

```javascript
// index.js
import { Provider } from 'react-redux';
import { store } from './store/index';
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
    - if state changes (since action was triggered via `dispatch()`), new state is returned automatically:

      - a) in case of primitive values, they are returned from `useSelector`, this leads only to re-evaluation of component if value was changed
      - b) in case of non-primitive values, this leads always to re-evalution of component, even if object has same content (because of strict `===` reference equality checks)

        - in `Redux Toolkit` you can use `createSelector()` (fn signature: `createSelector(…inputSelectors | [inputSelectors], resultFunction)`) to memoize a result fn, which can be based on multiple input selectors
        - rules to make this work: <https://medium.com/swlh/building-efficient-reselect-selectors-759800f8ed7f>

          - 1. input selectors should return the `leaf node` (-> the bottom level of an object or array),
          - 2. input selector functions can take additional arguments, which would have to be passed in when calling your selector.

            ```typescript
            // Example 1
            // DOES NOT MEMOIZE HERE, because the extra parameters is included in the memoization checks, so if you are passing in different arguments on every call, that effectively means the memoization becomes useless.
            const parameterized = createSelector(
              (state, id) => ... // additional id parameter
            );
            // In your component somewhere
            parameterized(getState(), id); // id gets passed in here

            const createParameterizedSelector = (id) => {
              return createSelector(
                (state) => state.todos[id],
                (todo) => todo // or heavy computation logic
              );
            }

            // usage in a component
            const ToDoItem = (id) => {
              const { todo } = useSelector(createParameterizedSelector(id))
              // ...
            }
            ```

        - 2 advantages: 1) the result of multiple input selectors is memoized until a concerning state was updated; 2) when you have performance intensive tasks, this doesn't have to be done again until the state changed

        ```typescript
        // Example 2
        // https://react-redux.js.org/api/hooks
        import { createSelector } from '@reduxjs/toolkit';

        const selectNumCompletedTodos = createSelector(
          (state: Rootstate) => state.todos,
          // return of first arg of createSelector is first parameter of snd arg ... and so on, return of snd arg could be first parameter of third arg ...
          (todos) => todos.filter((todo) => todo.completed).length
        );

        // Component
        export const CompletedTodosCounter = () => {
          const numCompletedTodos = useSelector(selectNumCompletedTodos);
          return <div>{numCompletedTodos}</div>;
        };
        ```

        ```typescript
        // Example 3: more complex with multiple input selectors
        import { createSelector } from '@reduxjs/toolkit';

        export interface SelectedPSBMonthIndices {
          selectableIndices: number[];
          deselectableIndices: number[];
        }

        export const getSelectablePSBMonthIndices = createSelector(
          (state: RootState) => state.monatsplaner.elternteile.ET1.months,
          (state: RootState) => state.monatsplaner.elternteile.remainingMonths.PSB,
          (months, remainingMonthsPSB): SelectedPSBMonthIndices => {
            const currentPSBIndices = months.flatMap((month, index) => (month.type === 'PSB' ? [index] : []));
            if (currentPSBIndices.length === 0) {
              return {
                selectableIndices: months.map((_, index) => index),
                deselectableIndices: [],
              };
            }

            const lowestIndex = currentPSBIndices[0];
            const highestIndex = currentPSBIndices[currentPSBIndices.length - 1];

            if (remainingMonthsPSB > 0) {
              return {
                selectableIndices: [lowestIndex - 1, highestIndex + 1],
                deselectableIndices: [lowestIndex, highestIndex],
              };
            } else {
              return {
                selectableIndices: [],
                deselectableIndices: [lowestIndex, highestIndex],
              };
            }
          }
        );

        // Component
        export const Monatsplaner: VFC = () => {
          // const selectablePSBMonths = useAppSelector((state) => getSelectablePSBMonthIndices(state));
          // Eta Reduction version
          const selectablePSBMonths = useAppSelector(getSelectablePSBMonthIndices);
          // ...
        };
        ```

  - `useStore`: select whole store

- `createAction()`
  > <https://redux-toolkit.js.org/api/createAction>
  - a helper function to define a Redux action type and creator: `function createAction(type, prepareAction?)`

```typescript
// The usual way to define an action in Redux is to separately declare an action type constant and an action creator function for constructing actions of that type.
const INCREMENT = 'counter/increment';

const increment = (amount: number) => {
  return {
    type: INCREMENT,
    payload: amount,
  };
};

const action = increment(3); // { type: 'counter/increment', payload: 3 }
```

- `createAction` helper combines these two declarations above into one.

```typescript
import { createAction } from '@reduxjs/toolkit';

const increment = createAction<number | undefined>('counter/increment');

let action = increment(); // { type: 'counter/increment' }
action = increment(3); // returns { type: 'counter/increment', payload: 3 }

console.log(increment.toString()); // 'counter/increment'
console.log(`The action type is: ${increment}`); // 'The action type is: counter/increment'
```

- generated action creators (-> like `increment()`) accept a single argument, which becomes action.payload
- if you want to write additional logic to customize the creation of the payload value, createAction accepts an optional second argument: a "prepare callback" that will be used to construct the payload value.

```typescript
import { createAction, nanoid } from '@reduxjs/toolkit';

const prepare = (text: string) => ({
  payload: {
    text,
    id: nanoid(),
    createdAt: new Date().toISOString(),
  },
});

const addTodo = createAction('todos/add', prepare);
console.log(addTodo('Write more docs'));
/**
 * {
 *   type: 'todos/add',
 *   payload: {
 *     text: 'Write more docs',
 *     id: '4AJvwMSWEHCchcWYga3dj',
 *     createdAt: '2019-10-03T07:53:36.581Z'
 *   }
 * }
 **/
```

- usage with `createReducer()`: because of their `toString()` override, action creators returned by `createAction()` can be used directly as keys for the case reducers passed to `createReducer()` or as `extraReducers` in `createSlice()`.

```typescript
import { createAction, createReducer } from '@reduxjs/toolkit';

const increment = createAction<number>('counter/increment');

// Version 1
const counterReducer = createReducer((state = { counter: 0 }), (builder) => {
  builder.addCase(increment, (state, action) => state.counter + action.payload);
});

// Version 2
const counterSlice = createSlice({
  name: 'counter',
  initialState: { counter: 0 },
  reducers: {
    /*... */
  },
  extraReducers: (builder) => {
    builder.addCase(increment, (state, action) => {
      return state.counter + action.payload;
    });
  },
});
```

- retrieve `dispatch` fn with help of `useDispatch` hook
  - dispatch fn receives action object that can contain an action type property and a payload property

```javascript
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

- `npm i @reduxjs/toolkit` (-> includes Redux, so you can remove Redux from `package.json`)
- `createSlice({ name: '...', initialState: ..., reducers: { ... } })`: with this fn you can create different slices of the global state to make code more maintainable
  - `reducers` key includes all reducers methods that this slice needs;
    - all methods could have 2 parameters: `state`, `action`;
    - a) with this methods, you can dispatch actions without using if statements like in a "normal" reducer fn
      - in fn body, you are allowed to mutate the state (-> normally NEVER DO IT) because of Redux Toolkit
      - uses iternally `Immer` that detects when state should be mutated and clones existing state, keeps all the state that you are not editing and overwrites desired piece of state in an immutable way;
    - b) `createSlice` creates `action creator methods` for you that returns `unique action identifiers` for different reducers
      - e.g. when you call later `counterSlice.actions.yourReducerName()`, Redux Toolkit returns an action obj of this shape: `{ type: 'some unique identifier' }`
- `configureStore({ reducer: ... })` creates store like `createStore` of basic Redux, but can merge multiple reducers into one reducer;
  - pass in a `configuration obj` with `reducer prop` that can have obj of different `key reducer pairs` of your choice to include multiple reducers
  - recommended way to integrate multiple reducers is to create the a `const reducers` obj with the `combineReducers()` (see below)
  - if you have only one reducer, then you don't need this obj (-> `reducer: counterSlice.reducer` would be enough)
  - attention: you point at `reducer`, even if you write `reducers` in createSlice()
- it is recommended to split code -> that means to put every slice of state into its own file

### Basic Example of Redux in React with Redux Toolkit, multiple slices of global state and code splitting

```javascript
// store/counter.js
// simplify redux using with createSlice (recommended) or createReducer fn
import { createSlice } from '@reduxjs/toolkit';

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

// export action dispatchers that you can use it in other components to update the state
export const counterActions = counterSlice.actions;
// if you only need reducer, then export only this
export default counterSlice.reducer;
```

```javascript
// store/auth.js
import { createSlice } from '@reduxjs/toolkit';

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

export const authActions = authSlice.actions;
export default authSlice.reducer;
```

```typescript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter';
import authReducer from './auth';

// recommended: use combineReducers() of reduxjs/toolkit to create reducers obj with reducers of multiple slices, then you can insert this obj below
const reducers = combineReducers({
  counter: counterSlice.reducer,
  auth: authSlice.reducer,
});

const store = configureStore({
  // reducer: counterSlice.reducer,
  // reducer: {
  //   counter: counterSlice.reducer,
  //   auth: authSlice.reducer,
  // },
  reducer: reducers,
});

export default store;

// TypeScript specific
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
```

- dispatch action with `payload` with Redux Toolkit: payload is passed into reducer fn with a simple argument that is converter by Redux Toolkit to a `payload property`

```javascript
// components/Counter.js
import { useSelector, useDispatch } from 'react-redux';
import { counterActions } from '../store/counter';

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

```javascript
// components/Auth.js
import { useDispatch } from 'react-redux';
import { authActions } from '../store/auth';

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

## Side Effects, Async Tasks and Redux

- `Reducers` must be pure, side-effect free, synchronous functions: `Input(Old State + Action)` -> `Output (New State)`
  - NEVER perform async code in the reducer (like sending HTTP Request)
- side-effects and async tasks:
  - can be put inside the components (e.g. `useEffect`) after global state was updated in Redux store
  - replace default `action creators` of Redux Toolkit with your own ones

### Frontend Code Depends on Backend Code

1. One way to organize async tasks - `Backend does a lot of work`
   - Backend API transforms data & stores data
   - Frontend sends data & receives and uses response (i.e. less code on the frontend, ahead of the reducer)
2. Another way to organize async tasks - `Backend does NOT a lot of work`
   - Backend API just stores incoming data
   - Frontend transforms data & sends data (i.e more code on the frontend, ahead of the reducer)

### Fat Reducers vs Fat Components vs Fat Actions

- Where should the logic code go?
  - `Reducers + avoid Action Creators or Components`: when you have synchronous, side-effect free code (i.e. data transformations), then you typically chose Reducers
  - `Action Creators or Components + never use Reducers`: when you have async code or code with side-effects

### Example of State Slices For Following Sections

```javascript
// store/cart-slice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    // helper variable to avoid that - when opening app - fetched cart data is immediately sended back to server
    changedLocally: false,
  },
  reducers: {
    replaceCart: (state, { payload: { totalQuantity, items } }) => {
      state.totalQuantity = totalQuantity;
      state.items = items;
    },
    addItemToCart: (state, { payload: { id, title, price } }) => {
      state.totalQuantity++;
      state.changedLocally = true;

      const existingItem = state.items.find((item) => item.id === id);
      // following manipulating of existing state would be NO GO without Redux Toolkit
      if (!existingItem) {
        state.items.push({
          id,
          title,
          price,
          quantity: 1,
        });
      } else {
        existingItem.quantity++;
      }
    },
    removeItemFromCart: (state, { payload: id }) => {
      state.totalQuantity--;
      state.changedLocally = true;

      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
      }
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
```

### Async Tasks or side-effect with useEffect

- first dispatch actions in any component as you want to update global state in redux store
- then watch updated state with `useEffect` and perform async tasks or side-effect

```javascript
// App.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// ...

const App = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    // avoid calling sendData fn in useEffect for first rendering, is only called after action of user
    if (!cart.changedLocally) return;

    const sendData = async () => {
      dispatch(
        uiActions.showNotification({
          status: 'pending',
          title: 'Sending...',
          message: 'Sending cart data',
        })
      );

      const options = {
        method: 'PUT', // overwriting existing data
        body: JSON.stringify(cart),
      };
      // firebase test backend: 'cart.json' creates new cart node in database and store data there
      const res = await fetch('https://firebasedatabase.app/cart.json', options);

      if (!res.ok) throw new Error('Sending data failed.');

      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success',
          message: 'Sent cart data successfully',
        })
      );
    };

    // async fn returns a Promise: so you can catch all kinds of errors
    // that could occur in this fn and dispatch your wished action
    sendData().catch((_) => {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error',
          message: 'Sending data failed',
        })
      );
    });
  }, [cart]);

  return (
    <>
      {notification && (
        <Notification status={notification.status} title={notification.title} message={notification.message} />
      )}

      {/* ... */}
    </>
  );
};
```

### Async Tasks or side-effect VARIANT 1: Action Creator Thunk

- `thunk` is a function that delays an action until later
  - in other words: an action creator fn that does NOT return the action itself but another fn which eventually returns the action
  - so you can run some other code before dispatching the actual action object
- use `Action Creator Thunk` to put logic into Redux Toolkit files
  - for that take code of inside useEffect (look at example above) into your state slice file and create there your own action creator thunk that returns another fn
  - `Redux Toolkit` accepts as argument for `dispatch()` also action creators that returns another fn
  - Toolkit notices that and will execute that returned fn for you and gives you there automatically the `dispatch` parameter, so that you can dispatch actions in returned fn

```javascript
// App.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendCartData, fetchCartData } from './store/cart-actions';
import Notification from './components/UI/Notification';

const App = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    // only if data was changed locally, send HTTP request
    if (cart.changedLocally) dispatch(sendCartData(cart));
  }, [cart, dispatch]);

  // fetch cart data from backend when app is mounted
  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  return (
    <>
      {notification && (
        <Notification status={notification.status} title={notification.title} message={notification.message} />
      )}

      {/* ... */}
    </>
  );
};
```

```javascript
// store/cart-actions.js
import { uiActions } from './ui-slice';
import { cartActions } from './cart-slice';

// create own action creator (default action creators are like cartActions.addItemToCart({...}))
export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data',
      })
    );

    const sendRequest = async () => {
      const options = {
        method: 'PUT', // overwriting existing data
        body: JSON.stringify(cart),
      };
      // firebase test backend: 'cart.json' creates new cart node in database and store data there
      const res = await fetch('https://firebasedatabase.app/cart.json', options);

      if (!res.ok) throw new Error('Sending data failed.');
    };

    // catch all kinds of errors that could occur in this sendRequest fn
    // and dispatch your wished succes or error action
    try {
      // sendRequest is async fn, that means it returns a Promise obj, so have to use await
      await sendRequest();

      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success',
          message: 'Sent cart data successfully',
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error',
          message: 'Sending data failed',
        })
      );
    }
  };
};

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const res = await fetch('https://firebasedatabase.app/cart.json');
      if (!res.ok) throw new Error('Error while fetching data');

      const data = await res.json();
      return data;
    };

    try {
      const { items, totalQuantity } = await fetchData();
      dispatch(
        cartActions.replaceCart({
          items: items || [], // Firebase does NOT store empty data, so items is undefined when app is opened with empty cart
          totalQuantity,
        })
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error',
          message: 'Fetching data failed',
        })
      );
    }
  };
};
```

### Async Tasks or side-effect VARIANT 2: Action Creator Thunk with createAsyncThunk

> Documentation: <https://redux-toolkit.js.org/api/createAsyncThunk>

- `createAsyncThunk` is a function that returns a promise

  - 3 parameters:

    - `string action type` value
    - `payloadCreator cb`: is basically the same code as in VERSION 1, but simplified since you don't have to handle errors there AND you don't need to dispatch any actions
    - `options` object

  - `React Toolkit automatically generates and dispatches actions` initially and when Promise resolves: it generates promise lifecycle action types based on the action type prefix that you pass in, and returns a thunk action creator that will run the promise cb and dispatch the lifecycle actions based on the returned promise

  ```typescript
  pending: 'users/requestStatus/pending';
  fulfilled: 'users/requestStatus/fulfilled';
  rejected: 'users/requestStatus/rejected';
  ```

- by using `createAsyncThunk`, code in actions file becomes much shorter

```javascript
// store/cart-actions.js
import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendCartData = createAsyncThunk('cart/sendData', async (cart) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({ items: cart.items, totalQuantity: cart.totalQuantity }),
  };
  const res = await fetch('https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/cart.json', options);
  if (!res.ok) throw new Error('Sending data failed.');
});

export const fetchCartData = createAsyncThunk('cart/fetchData', async () => {
  const res = await fetch('https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/cart.json');
  if (!res.ok) throw new Error('Error while fetching data');

  const data = await res.json();
  return {
    items: data.items || [], // Firebase does NOT store empty data, so items is undefined when app is opened with empty cart
    totalQuantity: data.totalQuantity,
  };
});
```

- in `createSlice` methods you can use automatically created actions
- `extraReducers` object: related methods have to be added in an `extraReducers object`, NOT in `reducers object`, since there a set of new actions would be created under the hood - and this work has already be done by `createAsyncThunk` above.
- additional info: it would be no problem to use automatically generated actions, e.g. `fetchCartData.fulfilled` in `extraReducers` of multiple slices, like here in the cart slice and the ui slice (if needed).

```javascript
// store/cart-slice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchCartData } from './cart-actions';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    changedLocally: false,
  },
  reducers: {
    // remove replaceCart action of code V1
    addItemToCart: (state, action) => {
      /* look at code V1 */
    },
    removeItemFromCart: (state, action) => {
      /* look at code V1 */
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartData.fulfilled, (state, { payload: { totalQuantity, items } }) => {
      state.items = items;
      state.totalQuantity = totalQuantity;
    });
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
```

```javascript
// store/ui-slice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchCartData, sendCartData } from './cart-actions';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { isCartVisible: false, notification: null },
  reducers: {
    toggle: (state) => {
      /* look at code V1 */
    },
    // remove showNotifcation action of original code V1
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.rejected, (state, action) => {
        state.notification = {
          status: 'error',
          title: 'Error',
          message: action.error.message || 'Fetching data failed',
        };
      })
      .addCase(sendCartData.pending, (state) => {
        state.notification = {
          status: 'pending',
          title: 'Sending...',
          message: 'Sending cart data',
        };
      })
      .addCase(sendCartData.fulfilled, (state) => {
        state.notification = {
          status: 'success',
          title: 'Success',
          message: 'Sent cart data successfully',
        };
      })
      .addCase(sendCartData.rejected, (state) => {
        state.notification = {
          status: 'error',
          title: 'Error',
          message: 'Sending data failed',
        };
      });
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
```

### Async Tasks or side-effect VARIANT 3: React Toolkit Query

- Documentation: <https://redux-toolkit.js.org/rtk-query/overview>
- data fetching and caching logic is built on top of Redux Toolkit's `createSlice` and `createAsyncThunk` APIs
- can generate React hooks that encapsulate the entire data fetching process, provide `data` and `isLoading` fields to components, and `manage the lifetime of cached data` as components mount and unmount
- `createApi()`
  - allows to define set of endpoints, describe how to retrieve data from a series of endpoints, including configuration of how to fetch and transform that data
  - `Recommended`: in most cases, use it `once per app`, with `one API slice per base URL`
- `fetchBaseQuery()`
  - small wrapper around fetch to simplify requests
  - it's recommended to use `baseQuery` in `createApi`
- `Recommendation`:
  - use RTK Query for data fetching
  - use Thunks for logic that requires talking to the store
  - use listeners if your code needs to react to actions or state changes

#### Create an API Slice

```typescript
// Create an API Slice
// store/cart-api-slice.ts
// RTK Query: Create an API Slice
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Item {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface Cart {
  totalQuantity: number;
  items: Item[];
}

// Define a service using a base URL and expected endpoints
export const cartApi = createApi({
  reducerPath: 'cartApi',
  // built-in fetch wrapper
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app',
  }),
  tagTypes: ['Cart'], // define tag(s) which can trigger an action
  endpoints: (builder) => {
    return {
      // in angle brackets, define return type generics a) for API response and
      // b) for arguments that are passed into fn
      getCart: builder.query<Cart, string | void>({
        query: (WISHED_QUERY_PARAM_TO_ADD) => '/cart.json',
        providesTags: ['Cart'],
      }),
      // mutation method is for updating data
      updateCart: builder.mutation<Cart, Partial<Cart>>({
        query: (cart) => ({
          url: '/cart.json',
          method: 'PUT',
          body: JSON.stringify({ items: cart.items, totalQuantity: cart.totalQuantity }),
        }),
        invalidatesTags: ['Cart'], // this triggers re-fetching of getCart
      }),
    };
  },
});

// automatically generated query hook
export const { useGetCartQuery, useUpdateCartMutation } = cartApi;
```

#### Create a Listener Middleware

> Official Documentation: <https://redux-toolkit.js.org/api/createListenerMiddleware>
> Article: <https://blog.logrocket.com/redux-toolkits-new-listener-middleware-vs-redux-saga/>

- `createListenerMiddleware`: lets you define "listener" entries that contain an "effect" callback with additional logic, and a way to specify when that callback should run based on dispatched actions or state changes
  - Conceptually, it's similar to `useEffect hook`, except that it runs logic in response to Redux store updates instead of component props/state updates
  - Listener effect callbacks have access to `dispatch` and `getState`, similar to thunks.
  - listener also receives a set of `async workflow functions` like `take`, `condition`, `pause`, `fork` and `unsubscribe`, which allow writing more complex async logic.
  - define listeners statically by calling `listenerMiddleware.startListening()` during setup, or add and remove it dynamically at runtime with special `dispatch(addListener())` and `dispatch(removeListener())` actions

```typescript
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import todosReducer, { todoAdded, todoToggled, todoDeleted } from '../features/todos/todosSlice';

// Create the middleware instance and methods
const listenerMiddleware = createListenerMiddleware();

// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
listenerMiddleware.startListening({
  actionCreator: todoAdded,
  effect: async (action, listenerApi) => {
    // Run whatever additional side-effect-y logic you want here
    console.log('Todo added: ', action.payload.text);

    // Can cancel other running instances
    listenerApi.cancelActiveListeners();

    // Run async logic
    const data = await fetchData();

    // Pause until action dispatched or state changed
    if (await listenerApi.condition(matchSomeAction)) {
      // Use the listener API methods to dispatch, get state,
      // unsubscribe the listener, start child tasks, and more
      listenerApi.dispatch(todoAdded('Buy pet food'));

      // Spawn "child tasks" that can do more work and return results
      const task = listenerApi.fork(async (forkApi) => {
        // Can pause execution
        await forkApi.delay(5);
        // Complete the child by returning a value
        return 42;
      });

      const result = await task.result;
      // Unwrap the child result in the listener
      if (result.status === 'ok') {
        // Logs the `42` result value that was returned
        console.log('Child succeeded: ', result.value);
      }
    }
  },
});

const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  // Add the listener middleware to the store.
  // NOTE: Since this can receive actions with functions inside,
  // it should GO BEFORE the serializability check middleware
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
```

#### Configure the Store

- `API slice` (-> here const `cartApi`) contains an auto-generated Redux slice reducer and a custom middleware that manages subscription lifetimes; add both to Redux store

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import uiSliceReducer from './ui-slice';
import cartSliceReducer from './cart-slice';
// Variant with RTK Query
import { cartApi } from './cart-api-slice';

const store = configureStore({
  reducer: {
    ui: uiSliceReducer,
    cart: cartSliceReducer,
    // Add generated reducer as a specific top-level slice
    [cartApi.reducerPath]: cartApi.reducer,
  },
  // Adding api middleware enables caching, invalidation, polling,
  // and other useful features of RTK Query
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(cartApi.middleware);
  },
});

export default store;

// TypeScript specific
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
```

#### Use Hooks in Components

- call auto-generated hook in component with any needed parameters
- RTK Query automatically fetches data on mount, re-fetch when parameters change, provide `{ data, isFetching }` values in the result, and re-render the component as those values change

```tsx
import { useGetCartQuery, useUpdateCartMutation } from './store/cart-api-slice';

const App = () => {
  // query hook automatically fetches data and returns query values
    const {
    data = { totalQuantity: 0, items: [] },
    error,
    isFetching,
    isLoading,
    isSuccess,
    isError,
  } = useGetCartQuery();

  const [
    updateCart, // mutation trigger fn
    { isLoading: isUpdating }, // destructured mutation result (see in doc)
  ] = useUpdateCartMutation();

  useEffect(() => {
    // only if data was changed locally, send HTTP request
    if (cart.changedLocally) updateCart(cart);
  }, [cart, updateCart]);

  return (
    // ...
  )
}

```

## React Redux with TypeScript

- Documentation: <https://redux.js.org/usage/usage-with-typescript>

## Redux DevTools

- install as browser plugin: Firefox <https://addons.mozilla.org/de/firefox/addon/reduxdevtools/>
- with `Redux Toolkit` no additional setup is required to make it run; open extra window simply in browser Dev Tools (-> `F12`)
- some usefull information:
  - `@@INIT` is first initialization of Redux store with default values
  - you receive a chronological list of dispatched actions with insights into the data that was transported by the action
  - you can test certain user path and play it later step by step to find and solve errors OR click on `jump` on a wished step to jump directly in history to this state point in the browser
  - even `Jest` test templates are available
