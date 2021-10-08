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
  - cleanup function is now executed always BEFORE useEffect runs the text time

  ```JavaScript
  useEffect(() => {
    const timerId = setTimeout(() => {
      setFormIsValid(enteredEmail.includes('@') && enteredPassword.trim().length > 6);
    }, 500);
    return () => clearTimeout(timerId);
  }, [enteredEmail, enteredPassword]);
  ```

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
  <!-- -> could be look like in real DOM like this -->
  <section>
    <h2>Some other content ... </h2>
    <div class="my-modal">
      <h2>Modal Title</h2>
    </div>
    <form>
      <label>Username</label>
      <input type="text" />
    </form>
  ```

- semantically abd from "clean HTML structure" perspective, having this nested modal isn't ideal. It's an overlay to the entire page after all (that's similar fro side-drawers, other dialogs etc.)
- portals good way to render wished component (-> like a modal) somewhere else, not so deeply nested, but on another place in the real DOM

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
