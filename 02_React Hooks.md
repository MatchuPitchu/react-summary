# React Hooks

- Rules of Hooks:
  1. only call React Hooks a) in React Component Functions or b) in Custom Hooks
  1. only call React Hooks at the Top Level, NOT in nested functions, NOT in any block statements
  1. recommanded rule for useEffect: ALWAYS add everything you refer to inside to useEffect as a dependency except the state updating functions (-> setName ...) because they never change

## useRef Hook

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

## Forward Refs Hook

- allows to interact with a component imperatively in the real DOM (-> look at `useRef` Hook)
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

      // 1. ref in same component
      const focus = () => {
        // available on input DOM obj when you're using ref in same component
        inputRef.current.focus();
      };

      // 2. ref in parent component: you can only use things of the ref that are exposed in return of useImperativeHandle Hook;
      // first arg: ref from outside (from parent component)
      // second arg: anonymous callback fn
      useImperativeHandle(ref, () => {
        // return a translation obj with all data that you would use from outside
        return {
          // define externally available name (-> here 'focus') that points to focus function
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

## useEffect Hook for "side effects"

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

## useReducer for State Management

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

### Example with useReducer

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

## useState vs useReducer

- use useReducer when using useState becomes cumbersome or you're getting a lot of bugs/unintended behaviors
- useState
  - main state management "tool"
  - great for independent simple pieces of state/data
  - great if state updates are easy and limited to a few kinds of updates (-> if you don't have lots of different cases that will change the state, if you don't have an obj as state)
- useReducer
  - great if you have more complex state updates (-> different cases, different actions that change the state) you can write a reducer fn that contains more complex state updating logic
  - should be considered if you have related pieces of state/data (i.e. form inputs that are related)

## useCallback Hook

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

## useMemo Hook

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

## Context API & useContext Hook

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

- b) recommanded and more complex context setup: to pull out more logic out of specific components and create a separate context management component

  - hint: you can create a custom hook which returns context data object -> to avoid importing the Context in every other component file where you're using it
  - context file:

    ```JavaScript
    // AuthContext.js
    import { useState, useEffect, createContext } from 'react';

    // initialize context with default data obj to have better autocompletion in VSC;
    // later import { AuthContext } in all components where you need context data (OR use directly custom hook below)
    export const AuthContext = createContext({
      isLoggedIn: false,
      onLogout: () => {},
      onLogin: (email, password) => {},
    });

    // custom hook to check whether you are inside a provider AND it returns context data object
    export const useAuthContext = () => {
      const context = useContext(AuthContext);
      if (!context) throw new Error('useAuthContext must be used within AuthContextProvider');
      return context;
    };

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

## Custom Hooks

- helpful to share logic across multiple components or in other words outsource stateful logic into re-usable functions
- unlike normal functions, custom hooks can use other React hooks and React state
  - Important: all states used in custom hook will be attached to every component where the hook is used -> so a state update in the hook triggers a re-evaluation of the component
- name of hook has to start with `use`
- you can return whatever you want: single variable, array, object

### Example 1: useCounter Hook to count up and down

```JavaScript
// useCounter.js
import { useState, useEffect } from 'react';

// to make custom hooks configurable, pass arguments
// here: optional forwards parameter (true or false) that is true by default
const useCounter = (forwards = true) => {
  // all states used in custom hook will be tied to every component where hook is used
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forwards
        ? setCounter(prevCounter => prevCounter + 1)
        : setCounter(prevCounter => prevCounter - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [forwards]); // add 'forwards' as dependency to re-run useEffect 'forwards' changes

  return counter;
};

// ForwardCounter.js
const ForwardCounter = () => {
  const counter = useCounter(); // calling custom hook fn

  return <Card>{counter}</Card>;
};
```

### Example 2: useHttp Hook to bundle logic for HTTP requests

```JavaScript
// useHttp.js
import { useState, useCallback } from 'react';

// custom hook to send any kind of HTTP request to any kind of URL and
// to work with JSON data
const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // use useCallback to avoid infinite loop when using sendRequest fn
  // as dependency in useEffect in a component
  const sendRequest = useCallback(async (requestConfig, applyDataFn) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(requestConfig.url, {
        // default settings are added in case that no args are passed
        method: requestConfig.method ? requestConfig.method : 'GET',
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!res.ok) throw new Error('Request failed!');

      const data = await res.json();
      // in the hook we just hand the data off to the applyDataFn, but the fn itself and
      // what happens in the fn is provided by the component that uses hook
      applyDataFn(data);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setLoading(false);
  }, []); // dependency arr should list all external changable data used in fn

  return {
    loading,
    error,
    sendRequest,
  };
};

// App.js -> use case of useHttp for GET request
import { useEffect, useState } from 'react';
import useHttp from './hooks/useHttp';
import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';

const App = () => {
  const [tasks, setTasks] = useState([]);
  // rename sendRequest into the alias fetchTasks
  const { isLoading, error, sendRequest: fetchTasks } = useHttp(); // here I can pass arg into my custom hook fn

  useEffect(() => {
    const transformTasks = tasksObj => {
      const loadedTasks = [];
      for (const taskKey in tasksObj) {
        loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
      }
      setTasks(loadedTasks);
    };

    // pass obj for request configuration into fetchTasks fn that is the sendRequest fn in useHttp hook
    fetchTasks(
      { url: 'https://some-firebase-url.app/tasks.json' },
      transformTasks
    );

    // without fetchTasks() wrapped into useCallback in useHttp hook,
    // this dependency array would create infinite loop:
    // -> this dependency would create an infinite loop since all states
    // in custom hook are attached to the component where hook is used
    // -> a state update would trigger re-evaluation of component
    // -> this would recall the custom hook again
    // -> this recreates the sendRequest fn in useHttp and returns a new fn object
    // -> therefore useEffect here will run again
  }, [fetchTasks]);

  const taskAddHandler = task => setTasks(prevTasks => [...prevTasks, task]);

  return (
    <>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks items={tasks} loading={isLoading} error={error} onFetch={fetchTasks} />
    </>
  );
};

// NewTask.js -> use case for useHttp for POST request
import useHttp from '../../hooks/useHttp';
import Section from '../UI/Section';
import TaskForm from './TaskForm';

const NewTask = ({ onAddTask }) => {
  const { isLoading, error, sendRequest: sendTaskRequest } = useHttp();

  const createTask = (taskText, taskData) => {
    const generatedId = taskData.name; // firebase-specific => "name" contains generated id
    const createdTask = { id: generatedId, text: taskText };
    onAddTask(createdTask);
  };

  const enterTaskHandler = async taskText => {
    // renamed sendRequest fn of useHttp hook
    sendTaskRequest(
      {
        url: 'https://some-firebase-url.app/tasks.json',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { text: taskText },
      },
      // instead of copy pasting createTask fn inside the enterTaskHandler to have access to 'taskText' variable,
      // you can also use bind here to preconfigure the function and add a new arg when fn is executed;
      // first arg of bind() is always this keyword (here: not needed, so it's null)
      createTask.bind(null, taskText)
    );
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};
```

### Example 3: useInput Hook to bundle logic for value states and handlers for input fields of form

```JavaScript
// useInput.js
import { useState } from 'react';

const useInput = (validateValue) => {
  const [value, setValue] = useState('');
  // controls if user touched already input field
  const [touched, setTouched] = useState(false);

  // receive fn via props that tells how to validate value
  const valueValid = validateValue(value);
  // hasError only relevant for visual feedback for user
  const hasError = !valueValid && touched;

  const valueChangeHandler = ({ target }) => setValue(target.value);
  const inputBlurHandler = (e) => setTouched(true);

  const reset = () => {
    setValue('');
    setTouched(false);
  };

  return {
    value,
    valueValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

// SimpleInput.js -> use case for useInput for name + email input field
import useInput from '../hooks/useInput';

const SimpleInput = () => {
  // 4) use custom hook useInput to bunch logic together and use it for both inputs here
  // destructuring and define aliases to variables
  const {
    value: name,
    valueValid: nameValid,
    hasError: nameInvalid,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName,
  } = useInput((name) => !!name.trim()); // pass anonymous arrow fn as param into custom hook -> there const value of hook is passed inside; !! converts variable to boolean

  const {
    value: email,
    valueValid: emailValid,
    hasError: emailInvalid,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(
    (email) =>
      !!email.trim().match(
        // RFC 2822 standard email validation
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
  );

  let formValid = false;
  if (nameValid && emailValid) formValid = true;

  const submitHandler = (e) => {
    // avoid default behaviour that HTTP request is send to server which is serving the website;
    // would reload page and restart React App
    e.preventDefault();

    // form validation
    if (!formValid) return;

    console.log(`Name & Email: ${name} ${email}`);

    // reset input fields + field touched states
    resetName();
    resetEmail();
  };

  const nameInputClasses = `form-control ${nameInvalid ? 'invalid' : ''}`;
  const emailInputClasses = `form-control ${emailInvalid ? 'invalid' : ''}`;

  return (
    <form onSubmit={submitHandler}>
      <div className={nameInputClasses}>
        <label htmlFor='name'>Your Name</label>
        <input
          type='text'
          id='name'
          value={name}
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
        />
        {nameInvalid && <p className='error-text'>Name field is empty</p>}
      </div>
      <div className={emailInputClasses}>
        <label htmlFor='email'>Your E-Mail</label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        {emailInvalid && <p className='error-text'>E-Mail is invalid</p>}
      </div>
      <div className='form-actions'>
        <button disabled={!formValid}>Submit</button>
      </div>
    </form>
  );
};
```
