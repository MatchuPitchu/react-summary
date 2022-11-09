# React

> React Documentation: <https://reactjs.org/>
> React Repo for creating new React App: <https://github.com/facebook/create-react-app>
> Academind GitHub Repo of the course: <https://github.com/academind/react-complete-guide-code/tree/master>

- client-side JavaScript library for building reactive user interfaces
- traditionally, in web apps, you click a link -> wait for a new page to load, you click a button -> wait for some action to complete
- in React, you don't wait for new pages to load or actions to start
- with JavaScript you can manipulate HTML structure (`DOM`) -> that allows to change what user sees without sending a request to the server and waiting for new fetched HTML page

## Vanilla JavaScript vs React

- with Vanilla JavaScript you have to define clear step-by-step instructions, i.e. decribe every single step of a functionality (-> `imperative approach`)
- that reaches its limits at some point AND developer has to take care of all details and has to do repetitive tasks

  ```JavaScript
    const modalCancelAction = document.createElement('button');
    modalCancelAction.textContent = 'Cancel';
    modalCancelAction.className = 'btn btn--alt';
    modalCancelAction.addEventListener('click', closeModalHandler);
  ```

- in React basic steps are done by the library; the developer describes rather on a higher level the final result of what should be displayed on the screen, i.e. the desired target state(s)
- React will figure out the actual JavaScript DOM instructions (-> `declarative approach`)
- in React the code of one app is splitted in multiple small components that are responsible for one clear task -> so code stays maintainable and manageable
- React library is doing the rendering and combining of the code

## React: Virtual DOM & DOM Updates

- React `virtual DOM` determines how the component tree currently looks like and what it should look like after a state update
- the `ReactDOM` receives the differences between previous and current states and then manipulates the `real DOM` (-> that's what users see)
- `Notice`: state in React is immutable and can only be updated with `setState()` because otherwise React would have NO chance to know if state changed in a component
- React cares about components and updates `real DOM` if one of the following changes:
  - `props`: data from a parent component to make components configurable and enable parent-child-component communication
  - `state`: internal data of a component
  - `context`: component-wide data
- `Virtual DOM Diffing`: React re-evaluates a component whenever `props`, `state` or `context` changes, i.e. re-exectues component function and with this all child component functions, BUT changes to the `real DOM` are only made for differences between these evaluations

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

### `React.memo()` to avoid unnessecary re-execution of a component

- using `React.memo(MyComponent)` on a stateless component with `props`
  - component function is only re-executed if `props` really changed with new values -> works well with `primitive values`
  - for `reference values` (-> `objects`, `functions`, `arrays`) that you pass as props to child component comparison doesn't work, because with every re-execution obj/fn/arr is re-created and so references are new and cannot be compared -> solution `useCallback Hook`
- `Notice`
  - do NOT use `React.memo()` on every component
  - memo costs also performance because React has to store prev state and compare it with current
  - use it to cut of a branch and avoid unnecessary re-render cylces on the entire branch
- `<Component>` could be wrapped in `React.memo()` if:
  - it is a `pure functional component`, i.e. `<Component>` renders same output, if same props are passed
  - it renders often
  - it re-renders usually provided with the same props
  - it has medium to big size, i.e. it contains a decent amount of UI elements to reason props equality check
  - you have a hugh component tree
  - it is on a high level in the tree
- `Custom equality check of props`:

  - by default `React.memo()` does shallow comparison of props and objects of props
  - to customize props comparison, use second argument to indicate an equality check function; `areEqual(prevProps, nextProps)` function must return true if `prevProps` and `nextProps` are equal.

    ```JavaScript
    const arePropsEqual = (prevProps, nextProps) => {
      return prevProps.name === nextProps.name && prevProps.id === nextProps.id;
    }
    React.memo(Component, arePropsEqual);
    ```

```JSX
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

  console.log('App Component running');

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
      component execution / re-evaluation -> so fn is NOT recreated with every execution and keeps same reference */}
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

## State & State Updates

- React manages the state for you
- when using `useState()` Hook, the default variable (e.g. `false` in `useState(false)`) is stored internally by React and even if component is re-executed `useState()` is not re-executed again unless the component was completely removed from the DOM in the meantime (e.g. if a component is rendered conditionally)
- new state can only be set with `setState()`
- state updates scheduling example:
  1. `<MyComponent />` has current string state `stateOne`
  2. calling `setState('stateTwo')` schedules state update with data `stateTwo` -> means NOT that current state changes instantly
  3. order of state changes (when multiple changes) is garanteed, but it could be that React executes first tasks with higher priority (-> e.g. input field where user is typing something in)
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

1. React can be used to control parts of HTML pages or entire pages (e.g. a sidebar) -> called `widget approach` on a multi-page-app
1. React can also be used to control the entire frontend of a web app called `SPA approach` (-> server only sends one HTML page, React takes over and controls UI)

## React Components

- components are a combination of HTML (structure), CSS (styling) and JavaScript (logic) code
- components are reusable building blocks that allows a separation of concerns
  - Reusability: Don't repeat yourself (DRY)
  - Separation of Concerns: Don't do too many things in one and the same place (function)
- in React all user interfaces are made up of components that are mixed and matched according to the application's needs
- component is just a JavaScript function

  ```JSX
  const App = () => {
    return (
      <div>Hello</div>
    )
  };
  ```

- in React you are building a component tree
  - only the top-most root component (-> in general `<App />`) is rendered directly into the single HTML page
  - then deeper components are nested inside of each other (e.g. `<Tasks />` -> `<Task />` -> ...)
- passing data from parent to child component with `props` obj

  ```JSX
  // inside parent component
  <Task title='Do this' />

  // child component
  const Task = (props) => {
    return <div>{props.title}</div>
  }
  ```

- JSX return of a component can only be one element, so React JSX requires one wrapper element

  - problem: with lots of nested components, you could end with lots of unnecessary `<div>`'s (or other elements) which slow down the rendering performance and add no semantic meaning or structure to the page but are only there because of React's/JSX requirement

  ```JSX
  return (
    <div>
      // inside you can add more elements
    </div>
  )

  // OPTION 1 - workaround: creating a helper wrapper component that returns only the children prop, i.e. what's between the wrapper in the component
  const Wrapper = ({ children }) => ({ children });

  // other component
  return (
    <Wrapper> /* more elements ... */ </Wrapper>
  )

  // OPTION 2 - recommanded: using React.Fragment or shortcut <></> as empty wrapper component
  import { Fragment } from 'react';

  return (
    <Fragment> /* ... */ </Fragment>
  )

  // OR simply without importing
  return (
    <> /* ... */  </>
  )
  ```

- passing `data from child to parent` component with function that's passed inside props obj

  ```JSX
  // inside parent components
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

## Rerendering of Components

- every state update with `setState()` triggers a re-rendering of the specific instance of this component (-> in a project could exist multiple instances of one component);
- that means with a re-execution of this instance, `const title` is assigned to the value that was updated before

  ```JavaScript
    const [title, setTitle] = useState(t);

    // often a convention to name fn with handle...
    const handleClick = ({target}) => {
      setTitle(target);
      console.log(target);
    };
  ```

## Two-way binding

- that means that you fetch data (e.g. of a form) and save it in a state variable when an input changes or is submitted AND at the same time this input has a value attribute which is binded to the state variable

  ```JSX
  const MyComponent = () => {
    // when you read a value of an input it's always a string (-> nums, dates ... are also read as strings)
    const [userInput, setUserInput] = useState('');

    const inputChangeHandler = ({ target: { value } }) => setUserInput(value);

    const submitHandler = (event) => {
      event.preventDefault();
      console.log(userInput); // do what ever you want after submitting, here only console.log
      setUserInput(''); // clear input
    };

    return (
      <form onSubmit={submitHandler}>
        <label>Name</label>
        <input
          type='text'
          value={userInput} // adding value attribute with state variable is called two-way binding
          onChange={inputChangeHandler}
        />
        <button type='submit'>Submit Name</button>
      </form>
    );
  };
  ```

- when both the value as well as changes to the value are not handled in the component itself, but in the parent component, then this child component is called `controlled component`(-> which uses two-way binding)

## Styling Components

- create css file with same name as js file
- import css file into component
- use `className` instead of `class` HTML keyword to add classes in JSX
- assign unique class or id names to target elements only in this component

  ```JSX
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

  ```JSX
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

  - `OPTION 1`: CSS Modules

    - creates unique versions of the styles of your css file, so they apply only to the wished component AND you avoid to have them in the global scope
    - it's already prefconfigured in React <https://create-react-app.dev/docs/adding-a-css-modules-stylesheet>

    ```JSX
    // a) rename css file to Filename.module.css
    // b) use -> import styles from './Filename.module.css'
    // c) replace className string with styles obj and add your needed classes as a property
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

  - `OPTION 2`: styled components package <https://styled-components.com>

    ```JSX
    // a) install npm package
    // b) import styled object
    // c) create component with method of wished HTML tag (button, div, p ...)
    // d) what's inside the backticks is passed inside the method
    // e) add normal css rules between backticks, remove HTML tag, because it's automatically added to wished HTML element
    // f) use "&" to indicate main HTML class (e.g. for pseudo-classes, nested selectors "& input {}" ...)
    // g) for conditional rendering look at documentation
    import styled from 'styled-components';

    const Button = styled.button`
      width: 100%;
      font: inherit;
      padding: 0.5rem 1.5rem;
      border: 1px solid #8b005d;
      /* Adapt the colors based on primary prop */
      color: ${props => props.primary ? "white" : "palevioletred"};
      background: ${props => props.primary ? "palevioletred" : "white"};
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

    const MyComponent = () => {
      return (
        <>
          <Button>Normal</Button>
          <Button primary>Primary</Button>
        </>
      );
    };
    ```

## Concept of "Composition" (-> "children props")

- when you have components with some identical CSS rules, you can build a wrapper container with the extracted wished CSS rules that should apply in general on multiple components

  ```JSX
  // Card.css
  .card {
    border-radius: 12px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
  }

  // Card.js
  import './Card.css';

  // a) pass className as prop into wrapper component
  // b) use React built-in prop "children" that every component receive;
  // "children" is recerved name -> value is always content between
  // opening and closing tags of my custom component (-> <Card>...</Card>);
  const Card = ({ className, children }) => {
    const classes = `card ${className}`;
    return <div className={classes}>{children}</div>;
  };

  // Expenses.js
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

- wrapper components are also handy to extract more complexe JSX code (e.g. `Modal`, `Alert`, `Button`, `Notification`, `Sidebar`, `Layout` ) that you need in multiple components

  ```JSX
  // Button wrapper component
  const Button = ({ type, onClick, children }) => {
    return (
      <button type={type} className='button' onClick={onClick}>
        {children}
      </button>
    );
  };

  // Another component using Button
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

## Javascript Syntax Extension (JSX)

```JSX
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

- Example: deeply nested React Component `<MyModal />`

  ```JSX
  return (
    <>
      <MyModal />
      <MyInputForm />
    </>
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
- a `portal` renders component somewhere else, not so deeply nested, but on another place in real DOM

  - add div element(s) to index.html to hook into them later

  ```HTML
    <body>
      <div id="backdrop-root"></div>
      <div id="overlay-root"></div>
      <div id="root"></div>
    </body>
  ```

  - import `ReactDOM` in component(s) that should be rendered somewhere else, create normal wished components, use `createPortal` method to move rendering of this component(s) to another place

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
    // first argument in createPortal method is JSX React component that should be moved somewhere
    // -> important: pass props into this component;
    // second argument is element in index.html that you get e.g. by id
    // now it doesn't matter where - in which deep nested component - you are using Backdrop and Modal, it's always rendered attached to element with this id
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
