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

## Concept of "Composition" (-> "children props")

- when you have components with some identical CSS rules, you can build a wrapper container with the extracted wished CSS rules that should apply in general on multiple components
- wrapper components are also handy to extract more complexe JSX code (e.g. Modals, Alerts ) that you need in multiple components

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

export default Card;

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

export default Expenses;

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
