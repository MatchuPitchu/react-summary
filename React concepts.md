# React

> React Documentation: https://reactjs.org/

> React Repo for creating an new React App: https://github.com/facebook/create-react-app

> Academind GitHub Repo of the course: https://github.com/academind/react-complete-guide-code/tree/master

- client-side JS library four building reactive user interfaces
- Traditionally, in web apps, you click a link and wait for a new page to load. You click a button and wait for some action to complete. In React, you don't wait for new pages to load or actions to start
- with JS you can manipulate HTML structure (DOM) of a page -> that allows to change what user sees without sending a request to the server and waiting for new fetched HTML page

## Vanilla JavaScript vs ReactJS

- with Vanilla JS I have to give clear step-by-step instructions to JS, that means decribe every single step of a functionality (-> called `imperative approach`) which reaches its limits at some point AND developer has to take care of all details and has to do repetitive tasks

  ```JavaScript
    const modalCancelAction = document.createElement('button');
    modalCancelAction.textContent = 'Cancel';
    modalCancelAction.className = 'btn btn--alt';
    modalCancelAction.addEventListener('click', closeModalHandler);
  ```

- in React basic steps are done by the library; the developer describes rather on a higher level the end result of what should be displayed on the screen, in other words the desired target state(s), and React will figure out the actual JS DOM instructions (-> called `declarative approach`); in React the code of one application is splitted in multiple small components that are responsible for one clear task; so code stays maintainable and manageable; React library is doing the rendering and combining of the code

## React - How it works

### Virtual DOM & DOM Updates

- React `virtual DOM` determines how the component tree currently looks like and what it should look like after a state update
- the `ReactDOM` receives the differences between previous and current states and then manipulates the `real DOM` (-> that's what users see)
- React cares about components and updates `real DOM` if one of the following changes:
  - `props`: data from a parent component to make components configurable and enable parent-child-component communication
  - `state`: internal data of a component
  - `context`: component-wide data
- `Virtual DOM Diffing`: React re-evaluates a component whenever props, state or context changes, i.e. re-exectues component function and with this all child component functions, BUT changes to the `real DOM` are only made for differences between these evaluations

  - a virtual comparison between previous and current state needs only few resources (-> happens in memory)
  - reaching out the `real DOM` for rendering in the browser is expansive from a performance perspective

  ```JSX
  // prev evaluation result
  <div>
    <h1>Hello</h1>
  </div>

  // current evaluation result
  <div>
    <h1>Hello</h1>
    <p>New line</p> // <p> is inserted in DOM (rest stays unchanged)
  </div>
  ```

- use `React.memo()` to avoid unnessecary re-execution of a component

  - then component is only re-executed if props really changed and have new values -> works well with `primitive values`

  - for `reference values` like objects/functions/arrays that you pass as props to child components comparison doesn't work, because with every re-execution the obj/fn/arr is recreated and so references are new and cannot be compared -> solution `useCallback Hook`

  - Note: DON'T use React.memo() on every component; memo costs also performance because
    React has to store prev state and compare it with current; to cut of a branch and avoid unnecessary re-render cylces on the entire branch, it's recommanded if:
    - hugh component tree AND
    - rare changes of props AND
    - on a high level in the tree

  ```JavaScript
  // Examples - App.js
  const App = () => {
    const [show, setShow] = useState(false);
    const [enable, setEnable] = useState(false);

    const toggleBtn = useCallback(() => {
      if (enable) setShow(prev => !prev);
    }, [enable]);

    const enableToggleBtn = useCallback(() => {
      setEnable(true);
    }, []);

    console.log('APP Component running');

    return (
      <div>
        {/* 1) conditional <p> in same component:
        <div> parent node flashes, i.e. is updated after removing;
        <p> node flashes, i.e. is added to real DOM after clicking toggle */}
        {/* {show && <p>New line!</p>} */}

        {/* 2) conditional rendering <p> in child component using props:
        in my case <p> always stays in real DOM tree, so only <p> flashes;
        beside child component, also App component is re-evaluated because
        here state is managed */}
        <Demo show={show} />

        {/* 3) hard coded prop value (-> primitive value):
        if click Toggle, nevertheless all child components along the node tree are
        re-executed because state changes and the following re-evaluation of this component includes the return statement with <Demo /> etc. -> child components are
        then like fn that are re-evaluated too, BUT NO updates in real DOM are
        triggered because of NO changes */}
        {/* 4) React.memo() to avoid unnecessary re-evaluation:
        tell React only to re-evaluate child component if prop changes;
        wrap child component in React.memo() -> export default React.memo(Demo);
        then React looks at props that this component gets and compares current
        value(s) to prev value(s) and if no changes then no re-evaluation of all child components */}
        {/* <Demo show={false} /> */}

        {/* 5) React.memo() in a child component with fn as props (-> reference value):
        memo() has no cut off branch effect because on every re-execution
        of the App Component, toggleBtn fn is newly recreated;
        solution: useCallback Hook that stores a function in React internal storage across
        component execution / re-evaluation -> so fn is NOT recreated with every execution and remains the same for JS */}
        <Button onClick={enableToggleBtn}>Enable Toggle Button</Button>
        <Button onClick={toggleBtn}>Toggle</Button>
      </div>
    );
  };

  // Demo.js
  const Demo = ({ show }) => {
    console.log('DEMO Component running');
    return <Paragraph>{show ? 'New line!' : ''}</Paragraph>;
  };

  export default React.memo(Demo); // for 4) in App.js
  ```

### State & State Updates

- React manages the state for you
- when using useState() Hook, the default variable (like `false` in `useState(false)`) is stored internally by React and even if component is re-executed useState() is not re-executed again unless the component was completely removed from the DOM in the meantime (e.g. if a component is rendered conditionally)
- new state can only be set with `setState` fn
- state updates scheduling example:
  1. `<MyComponent />` has current string state `stateOne`
  2. calling `setState('stateTwo')` schedules state update with data `stateTwo` -> means NOT that current state changes instantly
  3. order of state changes (when you have severals) is garanteed, but it could be that React executes first tasks with higher priority (-> e.g. input field where user is typing something in)
  4. React will re-evaluate component fn AFTER the state change was processed (i.e. new state is active)
- since you can schedule multiple updates at the same time, use cb fn to update state if it depends on prev state (`setState(prev => prev + 1)`) to ensure that the latest state is used and NOT the last state when last the component was rendered
- `state batching`: if you have multiple state updates lines of code after each other in a synchronous fn (without time delay, not asynchronous), React will batch those updates together into one scheduled state update
  ```JavaScript
  const myFunc = (data) => {
    setNewState(data);
    setShowBtn(false);
  }
  ```

## Building Single-Page Applications (SPAs) with React

1. React can be used to control parts of HTML pages or entire pages (e.g. a sidebar) called widget approcach on a multi-page-app
2. React can also be used to control the entire frontend of a web app called SPA approach (-> server only sends one HTML page, React takes over and controls UI)

## React Components

- components are a combination of HTML (structure), CSS (styling) and JavaScript (logic) code
- components are reusable building blocks that allows a separation of concerns
  - Reusability: Don't repeat yourself (DRY)
  - Separation of Concerns: Don't do too many things in one and the same place (function)
- in React all user interfaces are made up of components that are mixed and matched according to the application's needs
- component is just a JS function
  ```JavaScript
  const App = () => {
    return (
      <div>Hello</div>
    )
  })
  ```
- in React I'm building a component tree
  - only the top-most root component (-> in general `<App />`) is rendered directly into the single HTML page
  - then deeper components are nested inside of each other (e.g. `<Tasks />` -> `<Task />` -> ...)
- passing data from parent to child component with `props` obj

  ```JavaScript
  // inside of parent component
  <Task title='Do this' />

  // child component
  const Task = (props) => {
    return <div>{props.title}</div>
  }
  ```

- JSX return of a component can only be one element, so React JSX requires one wrapper element

  - problem: with lots of nested components, you could end with lots of unnecessary <div>'s (or other elements) which slow down the rendering performance and add no semantic meaning or structure to the page but are only there because of React's/JSX requirement

  ```JavaScript
  return (
    <div>
      // inside you can add more elements
    </div>
  )

  // solution 1 - workaround: creating a helper wrapper component that returns only the children prop, i.e. what's between the wrapper in the component
  const Wrapper = ({ children }) => {
    return { children };
  };

  // other component
  return (
    <Wrapper>
      // more elements ...
    </Wrapper>
  )

  // recommanded built-in solution 2: using React.Fragment or shortcut <></> as empty wrapper component
  import { Fragment } from 'react';

  return (
    <Fragment>
      // ...
    </Fragment>
  )

  // OR simply without importing
  return (
    <>
      // ...
    </>
  )
  ```

- passing data from child to parent component with function that's passed inside props obj

  ```JavaScript
  // inside of parent components
  const newInputHandler = (inputValue) => {
    console.log(inputValue);
  };
  return <MyChildComponent onNewInput={newInputHandler} />

  // child component
  const MyChildComponent = ({ onNewInput }) => {
    const submitHandler = () => {
      const text = 'Hello World';
      onNewInput(text);
    };
    return (
      // ... e.g. any form
    )
  }
  ```

## Hooks

- Rules of Hooks:
  1. only call React Hooks a) in React Component Functions or b) in Custom Hooks
  1. only call React Hooks at the Top Level, NOT in nested functions, NOT in any block statements
  1. recommanded rule for useEffect: ALWAYS add everything you refer to inside to useEffect as a dependency except the state updating functions (-> setName ...) because they never change

### useRef Hook

- first time a component is rendered, React sets value of a ref variable to a real DOM element (-> NOT the virtual DOM of React, so you should not manipulate it, only React should) that is rendered based on a JSX element with a ref attribute and connection to the wished variable
- useful when you only want to read a value and never plan on changing anything, then you don't need useState

  ```JavaScript
  // Example with useRef instead of using useState
  // BUT not a good use case, because inputs are now uncontrolled (-> with useState and two way binding they would be controlled) components
  import { useRef } from 'react';

  const MyComponent = () => {
    const elRef = useRef();

    const submitData = (e) => {
      e.preventDefault();
      const name = elRef.current.value;
      console.log('Username: ' + name);
      // reset input field -> normally DON'T manipulate real DOM, but here for resetting input fields it's admissible
      elRef.current.value = '';
    }

    return (
      <form onSubmit={submitData}>
        <label htmlFor='username'>Username</label>
        <input
          id='username'
          type='text'
          // connect HTML element to a ref const created above with useRef hook
          ref={elRef}
        />
        <button type='submit'>OK</button>
      </form>
    )
  }
  ```

### Forward Refs Hook

- allows to interact with a component imperatively (in the real DOM, look at `useRef` Hook)
- with `useImperativeHandle` and `forwardRef` you can expose functionalities from a React component to its parent component to then use your component in the parent component through refs and trigger certain functionalities
- it's good for use case like focusing fields or scrolling, BUT in general it's better to avoid this because of manipulating directly the real DOM
- example of reusable input component and focussing invalid input field with help of `useRef`, `forwardRef` and `useImperativeHandle`

  ```JavaScript
  // Login.js
  const Login = () => {
    // ... states and logic

    const emailRef = useRef();
    const passwordRef = useRef();

    const submitHandler = (e) => {
      e.preventDefault();
      if (formIsValid) {
        // ...
      } else if (!emailIsValid) {
        // in Input component defined focus fn focusses invalid input field
        emailRef.current.focus();
      } else {
        passwordRef.current.focus();
      }
    };

    return (
      <form onSubmit={submitHandler}>
        <Input
          ref={emailRef}
          id='email'
          label='E-Mail'
          type='email'
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordRef}
          id='password'
          label='Password'
          type='password'
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    );
  };
  ```

  ```JavaScript
  // Input.js
  import { useRef, forwardRef, useImperativeHandle } from 'react';

  // beside props there is a second rarely used available parameter 'ref' for the case that a ref is set for this component from outside (-> look at parent component);
  // to make it possible that a ref is passed to this component, wrap component into React.forwardRef method;
  // forwardRef returns a React component that is capable of being bound to a ref
  const Input = forwardRef(
    ({ isValid, id, label, type, value, onChange, onBlur }, ref) => {
      const inputRef = useRef();

      const focus = () => {
        // available on input DOM obj when you're using ref in same component
        inputRef.current.focus();
      };

      // in parent component you can only use things of the ref that are exposed in return of useImperativeHandle Hook;
      // first arg: ref from outside (from parent component)
      // second arg: anonymous callback fn
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
            onBlur={onBlur}
          />
        </div>
      );
    }
  );
  ```

### useEffect Hook for "side effects"

- it's for tasks that must happen outside of the normal component evaluation and render cycle, especially since they might block or delay rendering (e.g. HTTP requests)
- examples for side effects: store data in browser storage, send HTTP requests to backend servers, set and manage timers etc.
- side effects cannot go directly as normal function into the component function because
  - a) if side effect triggers state change that would trigger rerendering of component that would result in an infinitive loop
  - b) side effects have there own rhythm when and how they receive data (HTTP requests)
- `useEffect(() => { ... }, [ dependencies ])` -> this function is always executed AFTER every component evaluation and only IF the specified dependencies changed

  - dependencies: add all "things" (variables, functions) that are used in the effect function if those "things" could change because your component (or some parent component) re-rendered

  ```JavaScript
    // Dummy example
    import { useState, useEffect } from 'react';

    let myTimer;

    const MyComponent = ({timerDuration}) => {
      const [timerIsActive, setTimerIsActive] = useState(false);

      useEffect(() => {
        if (!timerIsActive) {
          setTimerIsActive(true);
          myTimer = setTimeout(() => setTimerIsActive(false), timerDuration);
        }
      }, [timerIsActive, timerDuration]);
    };
  ```

- Cleanup function: when you trigger an effect in useEffect (like timeout, intervall etc.) then you have to clean this effect in a return statement

  - in example below, I debounce user input with setTimeout to trigger form validation only when user doesn't stroke a key for 500ms
  - but I wanna have only 1 ongoing timer at a time
  - so I have to use built-in clearTimeout function with saved const timerId
  - cleanup function is now executed always BEFORE useEffect runs the text time OR BEFORE the component is removed from the DOM (-> is unmounted)

  ```JavaScript
  useEffect(() => {
    const timerId = setTimeout(() => {
      setFormIsValid(enteredEmail.includes('@') && enteredPassword.trim().length > 6);
    }, 500);
    return () => clearTimeout(timerId);
  }, [enteredEmail, enteredPassword]);
  ```

### useReducer for State Management

- for more complex state management `useReducer` can replace `useState`
  - e.g. if you have multiple states, multiple ways of changing them or dependencies to other states, then useState often becomes hard or error-prone to use
  - useReducer is good option when you have to update a state that depends on another state (e.g. `setEmailIsValid(enteredEmail.includes('@'))`)
- concept of useReducer:

  - `const [state, dispatchFn] = useReducer(reducerFn, initialState, initFn)`
  - state: state snapshot used in the component re-render/re-evaluation cycle
  - dispatchFn: function that can be used to dispatch a new `action` (e.g. trigger an update of the state)
  - reducerFn: a function that is triggerd automatically once an action is dispatched (via `dispatchFn()`) - it receives the latest state snapshot and should return the new, updated state (`(prevState, action) => newState`)
  - initialState (optional): optional you can set an initial state
  - initFn: a function to set the inital state programmatically in case that the initial state is more complex (e.g. the result of an HTTP request)

- example of useReducer

  - function expression (`const emailReducer`) outside of component because inside of reducer fn I don't need any data that is generated inside of the component fn

  ```JavaScript
  import { useEffect, useReducer } from 'react';
  import classes from './Login.module.css';
  import Button from '../UI/Button/Button';

  const emailReducer = (prevState, action) => {
    // condition defined based on action parameter and a related wished state update return
    switch (action.type) {
      case 'USER_INPUT':
        return { value: action.val, isValid: action.val.includes('@') };
      case 'INPUT_BLUR':
        // it is guaranteed that prevState parameter is the last state snapshot
        return { value: prevState.value, isValid: prevState.value.includes('@') };
      default:
        return { value: '', isValid: false };
    }
  };

  const Login = ({ onLogin }) => {
    const [emailState, dispatchEmail] = useReducer(
      emailReducer, // reducer function
      { value: '', isValid: null } // initial state
    );

    const { isValid: emailIsValid } = emailState; // destructuring with alias

    const emailHandler = ({ target }) => {
      // dispatchFn of useReducer to pass an argument as an "action" (-> look at parameter of emailReducer fn);
      // here I'm using an obj with type key that describes what happpens AND a payload (-> here a value the user entered)
      dispatchEmail({ type: 'USER_INPUT', val: target.value });
    };

    const validateEmailHandler = () => {
      dispatchEmail({
        type: 'INPUT_BLUR', // action happens when focus is blurred, so I call type 'INPUT_BLUR'
        // value definition not needed here for action definition
      });
    };

    const submitHandler = (e) => {
      e.preventDefault();
      onLogin(emailState.value); // OR another login logic
    };

    return (
      <form onSubmit={submitHandler}>
        <div className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ''}`}>
          <label htmlFor='email'>E-Mail</label>
          <input
            type='email'
            id='email'
            value={emailState.value}
            onChange={emailHandler}
            // onBlur is activated when input loses focus
            onBlur={validateEmailHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    );
  }
  ```

#### useState vs useReducer

- use useReducer when using useState becomes cumbersome or you're getting a lot of bugs/unintended behaviors
- useState
  - main state management "tool"
  - great for independent simple pieces of state/data
  - great if state updates are easy and limited to a few kinds of updates (-> if you don't have lots of different cases that will change the state, if you don't have an obj as state)
- useReducer
  - great if you have more complex state updates (-> different cases, different actions that change the state) you can write a reducer fn that contains more complex state updating logic
  - should be considered if you have related pieces of state/data (i.e. form inputs that are related)

### useCallback Hook

- stores a function in React internal storage across component execution / re-evaluation -> then this fn is NOT recreated with every execution
- advantage: fn keeps the same reference in the `stack memory` that refers to the object in the `heap memory`;

  - now you can e.g. use `export default React.memo(ChildComponentName)` in child component because you can compare if functions changed or not; if fn remains unchanged then no re-rendering of a certain child component

- `const foo = useCallback(() => {}, [])`

  - first argument: cb function -> a memoized version of it is stored by React
  - second argument: dependency array
    - memoized version of cb fn only changes if one of the dependencies has changed
    - empty array means: cb fn wrapped into useCallback() will never change
    - functions in JS are `closures` -> they close over the values that are available in there environment; so JS logs in all variables that are used in the fn (below: `enable`) and stores these variables for the fn definition
    - in dependency array: list all variables, functions etc. that could change, then in case memoized version of cb fn is recreated

  ```JavaScript
  const App = () => {
    const [show, setShow] = useState(false);

    const toggleBtn = useCallback(() => {
      if (enable) setShow(prev => !prev);
    }, [enable]);

    return (
        <div>
          {/* if you use React.memo() in Button child component with fn as props (-> reference value):
          memo() has no cut off branch effect because on every re-execution of the App Component,
          toggleBtn fn is newly recreated -> solution: useCallback Hook */}
          <Button onClick={toggleBtn}>Toggle</Button>
        </div>
      );
    };
  }
  ```

### useMemo Hook

- while useCallback memoizes functions, useMemo memoizes other values (any kind of data that you wanna store)
- memoizes data to avoid re-calculation of performance intensive tasks
- `useMemo(() => {}, [])`

  - first argument: cb fn that `returns` what you want to store/memoizes
  - second argument: array of dependencies to ensure that stored value is updated if value in array changes
  - important like for `React.memo()`: NOT use it everywhere because it costs also performance and it needs space to store data

- Example 1) for `useMemo`, `useCallback` and `React.memo()`

  ```JavaScript
  // App.js
  const App = () => {
    const [listTitle, setListTitle] = useState('My List');

    const changeTitleHandler = useCallback(() => {
      setListTitle('New title');
    }, []);

    // Notice: items array is always recreated with every re-execution of component
    // because it's a reference value, it's technically never the same array,
    // so you can use useMemo Hook to memoize it
    const listItems = useMemo(() => [5, 3, 1, 10, 9], []);

    return (
      <div className='app'>
        <DemoList title={listTitle} items={listItems} />
        {/* Button uses React.memo() and fn that is passed via props uses useCallback, component never reruns */}
        <Button onClick={changeTitleHandler}>Change List Title</Button>
      </div>
    );
  };

  // DemoList.js
  const DemoList = ({ items, title }) => {
    // Example stands for a very performance intensive task
    const sortedList = useMemo(() => {
      console.log('ITEMS sorted');
      return items.sort((a, b) => a - b);
    }, [items]);

    console.log('DEMOLIST running');

    return (
      <div className={classes.list}>
        <h2>{title}</h2>
        <ul>
          {sortedList.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  export default React.memo(DemoList);
  ```

  - Example 2) for useMemo in combination with debounce fn from `lodash library`

  - to avoid that every key entry leads to a server request, use debounce fn that single request is fired only once when user stops typing for one second
  - wrap debounce fn in useMemo Hook to prevent React from creating a new reference in the `stack memory` to the debounce fn in the `heap memory` on every rerender

  ```JavaScript
  import { useMemo } from 'react';
  import { debounce } from 'lodash';

  const App = () => {
    // state management ...

    const handleChangeDebounced = useMemo(() => {
      return debounce(() => {
        // server request or whatever -> returns finally data
      }, 1000);
    }, []);

    return (
      <input
        onChange={(event) => {
          // update state ...

          handleChangeDebounced(); // debounced handler
        }}
        value={value}
      />
    );
  }
  ```

### Context API & useContext Hook

- context is a component-wide state storage

- a) basic context setup:

  - a basic context where I can pass data and functions to other components

    ```JavaScript
    // AuthContext.js
    import { createContext } from 'react';

    // initialize context with default data obj to have better autocompletion in VSC;
    // later import { AuthContext } in all components where you need context data
    export const AuthContext = createContext({
      isLoggedIn: false,
      onLogout: () => {},
    });
    ```

  - provide context: wrap in JSX code all components that should be able to listen to the context

    ```JavaScript
    // App.js
    import AuthContext from './context/AuthContext';
    // ...
    const App = () => {
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      // ... component logic
      const logoutHandler = () => {
        // ...
      };

      return (
        <AuthContext.Provider
          // all variables and functions listed here are available in all children components
          value={{
            isLoggedIn, // shorthand to "isLoggedIn: isLoggedIn", etc.
            logoutHandler
          }}
        >
          <MyComponent/>
          <main>
            <AnotherComponent />
            <Home />
          </main>
        </AuthContext.Provider>
      );
    }
    ```

- b) recommanded and more complex context setup: to pull out more logic out of specific components and create a saparate context management component

  - context file:

    ```JavaScript
    // AuthContext.js
    import { useState, useEffect, createContext } from 'react';

    // initialize context with default data obj to have better autocompletion in VSC;
    // later import { AuthContext } in all components where you need context data
    export const AuthContext = createContext({
      isLoggedIn: false,
      onLogout: () => {},
      onLogin: (email, password) => {},
    });

    // create context component and export it as the default export;
    // now I can use useState etc. and insert more logic into this component
    const AuthContextProvider = ({ children }) => {
      const [isLoggedIn, setIsLoggedIn] = useState(false);

      useEffect(() => {
        setIsLoggedIn(true);
      }, []);

      const logoutHandler = () => {
        // ... logout logic
        setIsLoggedIn(false);
      };

      const loginHandler = (email, password) => {
        // ... login logic
        setIsLoggedIn(true);
      };

      return (
        <AuthContext.Provider
          value={{
            isLoggedIn, // shorthand for "isLoggedIn: isLoggedIn", etc.
            logoutHandler,
            loginHandler,
          }}
        >
          {children}
        </AuthContext.Provider>
      );
    };

    export default AuthContextProvider;
    ```

  - provide context: wrapp whole app into context provider component to make context accessible to all children components

    ```JavaScript
    // index.js
    import ReactDOM from 'react-dom';
    import AuthContextProvider from './context/AuthContext';
    import App from './App';
    import './index.css';

    ReactDOM.render(
      <AuthContextProvider>
        <App />
      </AuthContextProvider>,
      document.getElementById('root')
    );
    ```

- a + b) consume (or listen) to the context with useContext

  ```JavaScript
  import { useContext } from 'react';
  import { AuthContext } from '../../context/AuthContext';

  const Navigation = () => {
    // pass the pointer to the context obj into useContext
    // create variables with destructuring;
    // with useContext Hook, component will be reevaluate when context changes
    const { isLoggedIn, logoutHandler } = useContext(AuthContext);

    return (
      <nav>
        <ul>
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    );
  };

  export default Navigation;
  ```

- context vs props
  - in short: props for configuration, context for state management accross components or the entire app
  - props
    - in most cases, use props to pass data to components, because props let you configure components and make them reusable
    - if you have smth that you will adapt often, like a button that you use in different situations and so you should be more flexible
  - context
    - if you have smth which you would forward to lots of components AND you are forwarding it to a component that does smth very specific or unique (-> like the navigation)
    - React Context is NOT optimized for high frequency changes (every second or multiple times every second) -> then Redux is option
  - React Context shouldn't be used to replace ALL component communications and props
  - a component should still be configurable via props AND short "prop chains" might not need any replacement

## Rerendering of Components

- every state update with the setState function triggers a rerendering of the specific instance of this component (-> in a project could exist multiple instances of one component);
- that means with a reexecution of this instance, `const title` is assigned to the value that was updated before

  ```JavaScript
    const [title, setTitle] = useState(t);

    // often a convention to name fn with ...Handler
    const clickHandler = ({target}) => {
      setTitle(target);
      console.log(target);
    };
  ```

## Two-way binding

- that means that you fetch data (e.g. of a form) and save it in a state variable when an input changes or is submitted AND at the same time this input has a value attribute which is binded to the state variable

  ```JavaScript
  const MyComponent = () => {
    // when I read a value of an input it's always a string (-> nums, dates ... are also read as strings)
    const [userInput, setUserInput] = useState('');

    const inputChangeHandler = ({ target }) => setUserInput(target.value);

    const submitHandler = (e) => {
      e.preventDefault();
      console.log(userInput); // do what ever you want after submitting, here only console.log
      setUserInput(''); // clear input
    };

    return (
      <form onSubmit={submitHandler}>
        <label>Name</label>
        <input
          type='text'
          // add value attribute here with state variable is called two-way binding
          value={userInput}
          onChange={inputChangeHandler}
        />
        <button type='submit'>Submit Name</button>
      </form>
    );
  };
  ```

- when both the value as well as changes to the value are not handled in the component itself, but in the parent component, then this child component is called `controlled component`(-> which uses two-way binding)

## Styling Components

- create CSS file with same name as JS file
- import css file into component
- use `className` instead of `class` HTML keyword to add classes in JSX
- assign unique class or id names to target elements only in this component

  ```JavaScript
  import './ExpenseItem.css';

  const ExpenseItem = () => {
    return (
      <div className='expense-item'>
        <div>March 28th 2021</div>
        <div className='expense-item__description'>
          <h2>E-Bike</h2>
          <div className='expense-item__price'>$3000</div>
        </div>
      </div>
    );
  };
  export default ExpenseItem;
  ```

- setting css classes dynamically: inline styles have the highest priority, so they overwrite all other css rules; therefore it's not recommanded, the better way is setting classes dynamically with template literal (`...`)

  ```JavaScript
  return (
    <form onSubmit={formSubmitHandler}>
      <div className={`form-control ${!isValid ? 'invalid' : ''}`}>
        {/* <label style={{ color: !isValid ? 'red' : 'black' }}>Course Goal</label> */}
        <label>Course Goal</label>
        <input type='text' onChange={goalInputChangeHandler} />
      </div>
      <Button type='submit'>Add Goal</Button>
    </form>
  );

  ```

- when you use specific css files to style elements in specific js files (-> e.g. task.js with task.css), then it's problematic that these css rules are in global scope and by mistake you could reuse them somewhere without wanting it

  - recommanded solution: Styling with CSS Modules

    - creates unique versions of the styles of your css file, so they apply only to the wished component AND you avoid to have them in the global scope
    - it's already prefconfigured in React: https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/

    ```JavaScript
    // a) rename css file to Filename.module.css
    // b) use -> import styles from './Filename.module.css'
    // c) replace className string with obj styles and add your needed classes as a property
    // d) conditional rendering with backticks as always
    import styles from './Filename.module.css';

    const Button = ({ children }) => {
      return (
        <button className={`${styles.button} ${!isValid && styles['btn-invalid']}`}>
          {children}
        </button>
      );
    };
    ```

  - my NOT preferred solution: use styled components package https://styled-components.com/

    ```JavaScript
    // a) install npm package
    // b) import styled object
    // c) create component with method of wished HTML tag (button, div, p ...)
    // d) what's inside the backticks is passed inside the method
    // e) add normal css rules between backticks, remove HTML tag, because it's automatically added to wished HTML element
    // f) use "&" to indicate main HTML class (e.g. for pseudo-classes, nested selectors "& input {}" ...)
    // g) for conditional rendering look in react learing goals app files
    import styled from 'styled-components';

    const Button = styled.button`
      width: 100%;
      font: inherit;
      padding: 0.5rem 1.5rem;
      border: 1px solid #8b005d;
      color: white;
      background: #8b005d;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.26);
      cursor: pointer;

      @media (min-width: 768px) {
        width: auto;
      }

      &:focus {
        outline: none;
      }

      &:hover,
      &:active {
        background: #ac0e77;
        border-color: #ac0e77;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.26);
      }
    `
    ```

## Concept of "Composition" (-> "children props")

- when you have components with some identical CSS rules, you can build a wrapper container with the extracted wished CSS rules that should apply in general on multiple components

  ```JavaScript
  // Create simple e.g. Card component in Card.js
  import './Card.css';

  // a) pass className as prop into wrapper component
  // b) use React built-in prop "children" that every component receive;
  // "children" is recerved name -> value is always content between
  // opening and closing tags of my custom component (-> <Card>...</Card>);
  const Card = ({ className, children }) => {
    const classes = `card ${className}`;
    return <div className={classes}>{children}</div>;
  };

  // Add wished CSS rules in Card.css
  .card {
    border-radius: 12px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
  }

  // Use Card as a wrapper for a component in order to apply all wished CSS rules
  // and combine them with specific rules (-> here in Expenses.css) of this component
  import Card from './Card';
  import './Expenses.css';

  const Expenses = ({ items }) => {
    return (
      <Card className='expenses'>
        // ... component content
      </Card>
    );
  };
  ```

- wrapper components are also handy to extract more complexe JSX code (e.g. Modals, Alerts, Buttons ) that you need in multiple components

  ```JavaScript
  // Button wrapper component
  const Button = ({ type, onClick, children }) => {
    return (
      <button type={type} className='button' onClick={onClick}>
        {children}
      </button>
    );
  };

  // Another component which uses Button in JSX return
  return (
    <form onSubmit={formSubmitHandler}>
      <div className='form-control'>
        <label>Course Goal</label>
        <input type='text' onChange={goalInputChangeHandler} />
      </div>
      <Button type='submit' onClick={clickHandler}>Add Goal</Button>
    </form>
  );
  ```

  ```CSS
  /* General button styling */
  .button {
    font: inherit;
    padding: 0.5rem 1.5rem;
    border: 1px solid #8b005d;
    color: white;
    background: #8b005d;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.26);
    cursor: pointer;
  }

  .button:focus {
    outline: none;
  }

  .button:hover,
  .button:active {
    background: #ac0e77;
    border-color: #ac0e77;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.26);
  }
  ```

## JSX - How it's working under the hood

```JavaScript
// JSX return
return (
  <div>
    <h1>Hello World</h1>
    <MyComponent passedProps={someDataObj} />
  </div>
);

// Function return with imported React.createElement method;
// in modern React version, don't need to import React obj any more
import React from 'react';

const App = () => {
  return (
    React.createElement(
      'div',
      {},
      React.createElement('h1', {}, 'Hello World'),
      React.createElement(MyComponent, { passedProps: someDataObj })
    );
  );
}
```

## React Portals of ReactDOM library

- Example of deeply nested React Component `<MyModal />`

  ```JavaScript
  return (
    <React.Fragment>
      <MyModal />
      <MyInputForm />
    </React.Fragment>
  )
  ```

  ```HTML
  <!-- -> in real DOM could look like this -->
  <section>
    <h2>Some other content ... </h2>
    <div class="my-modal">
      <h2>Modal Title</h2>
    </div>
    <form>
      <label>Username</label>
      <input type="text" />
    </form>
  </section>
  ```

- semantically from "clean HTML structure" perspective, having this nested modal isn't ideal. It's an overlay to the entire page after all (that's similar for side-drawers, other dialogs etc.)
- portals good way to render component (-> like a modal) somewhere else, not so deeply nested, but on another place in real DOM

  - add div element(s) to index.html to hook into them later

  ```HTML
    <body>
      <div id="backdrop-root"></div>
      <div id="overlay-root"></div>
      <div id="root"></div>
    </body>
  ```

  - import ReactDOM in component(s) that should be rendered somewhere else, create normal wished components, use createPortal method to move rendering of this component(s) to another place

  ```JavaScript
  import ReactDOM from 'react-dom'; // import for createPortal method
  import Card from './Card';
  import Button from './Button';
  import classes from './ErrorModal.module.css';

  const Backdrop = ({ onConfirm }) => {
    // backdrop overlay
    return <div className={classes.backdrop} onClick={onConfirm}></div>;
  };

  const ModalOverlay = ({ title, message, onConfirm }) => {
    return (
      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2>{title}</h2>
        </header>
        <div className={classes.content}>
          <p>{message}</p>
        </div>
        <footer className={classes.actions}>
          <Button onClick={onConfirm}>Okay</Button>
        </footer>
      </Card>
    );
  };

  const ErrorModal = ({ title, message, onConfirm }) => {
    // first argument in createPortal method is JSX React component that I wanna move somewhere
    // -> important: pass props into this component;
    // second argument is element in index.html that I get e.g. by id;
    // now it doesn't matter where - in which deep nested component - I use Backdrop and Modal, it's always rendered attached to element with this id
    return (
      <>
        {ReactDOM.createPortal(
          <Backdrop onConfirm={onConfirm} />,
          document.getElementById('backdrop-root')
        )}
        {ReactDOM.createPortal(
          <ModalOverlay title={title} message={message} onConfirm={onConfirm} />,
          document.getElementById('overlay-root')
        )}
      </>
    );
  };
  export default ErrorModal;
  ```
