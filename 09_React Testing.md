# Usefull Links

> React Testing Library Tutorial: https://www.robinwieruch.de/react-testing-library/

# Testing

- `Manual Testing`: Developer writes code and previews and tests code manually in browser
  - important to see what users will see
  - when implementing new features, other things may break
  - error-prone: hard to test all possible combinations and scenarios
- `Automated Testing`:
  - code that tests your code
  - test the individual building blocks of your app
  - allows you to test ALL building blocks at once
- Different kinds of automated tests:
  - `Unit Tests`:
    - test the individual building blocks (-> functions, components) in isolation
    - projects typically contain lots of unit tests
    - most common and important kind of test
  - `Integration Tests`:
    - test the combination of multiple building blocks (-> how components work together)
    - projects typically contain a couple of integration tests
    - React specific: in general not so easy to differentiate between integration and unit tests
    - important, but good to focus on unit tests in most cases
  - `End-to-End (e2e) Tests`:
    - test complete scenarios in your app as the user would experience them
    - projects typically contain only a few e2e tests
    - important but can also be done manually (partially)
- What and how to test?
  - test the different building blocks
  - unit tests = the smallest building blocks that make up your app
  - test success and error cases, test all possible scenarios (-> rare (but possible) results)

## Required or usefull Tools & Setup

1. [Jest]('https://jestjs.io/'): tool for test running -> finds and runs tests and determines whether tests pass or fail; a general JavaScript Testing Framework (-> not specific for React)
1. [React Testing Library]('https://testing-library.com/'): provides virtual DOM for "simulating" (-> rendering) the React app/components
   > Both tools are already set up when using create-react-app
1. [React Hooks Testing Library]('https://react-hooks-testing-library.com/'): tool for testing custom React hooks

# Testing React Components & Building Blocks

- `npm test` starts jest testing script: tests are executed and file changes are watches -> i.e. tests are always re-executed immediately
- 3 "A"s of writing tests:
  - `Arrange`: set up test data, test conditions and test environment
  - `Act`: run logic that should be tested (e.g. execute fn)
  - `Assert`: have a look inside the browser and compare received results with expected results
- `test()` is globally available, receives 2 args:
  1. description of test (`string`) to identifie test in output
  1. anonymous fn containing testing code
- `render(<App />)` creates virtual DOM (a simulated browser) for a JSX argument (-> a component and his entire component tree)
- `screen` allows access virtual DOM:
  - types of methods in screen obj:
    - `get...` fns `throw error` if element is not found
    - `query...` fns `return null` if element is not found (DON'T throw error),
    - `find...` fns `return a promise` (-> for asyncronous tasks if element is eventually on the screen)
  - 2nd arg of methods is object with `{ exact: false/true }`
    - `true`: default
    - `false`: casing doesn't matter and match occurs also for substrings
    - example: `screen.getByText('Hello World', { exact: false })` -> without `exact: false`, `Hello World` wouldn't match `Hello World!`
- `expect()` (-> Jest global fn starts assertion) with `matcher` method from Jest-DOM: e.g. `expect(linkElement).toBeInTheDocument()`
- `jest-dom`:
  - comes with create-react-app
  - `src/setupTest.js` imports it before each test, makes matchers available
  - DOM-based matchers: e.g. `toBeVisible()`, `toBeInTheDocument()`, `toBeChecked()`
  - general matchers (that can apply to any node code): `toBe()`, `toHaveLength()`

```JavaScript
// Example 1
// App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  // Arrange
  render(<App />);

  // Act
  // ...nothing

  // Assert
  // identifie element by a text (-> Regex case insensitive with learn react);
  const linkElement = screen.getByText(/learn react/i);
  // expect is globally available;
  // test succeeds if element is found and else fails
  expect(linkElement).toBeInTheDocument();
});
```

- `describe()` fn is globally available to create `testing suite` to group tests
  - 2 args: a) description string, b) anonymous fn that contains all test fns in the fn body
  - `good practice`: test suite description and test fn description form nice sentences to understand the aim of a test
- `role` of HTML element: overview of all possible roles https://www.w3.org/TR/html-aria/#docconformance

```JavaScript
// Example 2
// Greeting.js
import { useState } from 'react';
import Output from './Output';

const Greeting = () => {
  const [changedText, setChangedText] = useState(false);
  const changeTextHandler = () => setChangedText(true);

  return (
    <div>
      <h2>Hello World!</h2>
      {!changedText
        ? <Output>Good to see you</Output>
        : <Output>Text changed</Output>
      }
      <button onClick={changeTextHandler}>Change Text</button>
    </div>
  );
};

// Greeting.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // package to simulate user events
import Greeting from './Greeting';

describe('Greeting component', () => {
  test('renders Hello World as a text', () => {
    render(<Greeting />);
    // Assert
    const element = screen.getByText('Hello World', { exact: false });
    expect(element).toBeInTheDocument();
  });

  test('renders "good to see you" if button was NOT clicked', () => {
    render(<Greeting />);
    // Assert
    const paragraph = screen.getByText('good to see you', { exact: false });
    expect(paragraph).toBeInTheDocument();
  });

  test('renders "changed" if button was clicked', () => {
    render(<Greeting />);
    // Act
    // button is a role that elements can have on screen, and I have only 1 btn in this component, so the right one is selected
    const btn = screen.getByRole('button');
    userEvent.click(btn);
    // Assert
    const outputElement = screen.getByText(/changed/i);
    expect(outputElement).toBeInTheDocument();
  });

  test('does not render "good to see you" if button was clicked', () => {
    render(<Greeting />);
    // Act
    const btn = screen.getByRole('button');
    userEvent.click(btn);
    // Assert
    // returns null if element is not found on screen
    const outputElement = screen.queryByText('good to see you', { exact: false });
    expect(outputElement).toBeNull();
  });
});
```

- async test
  - problem: during development, DON'T send real HTTP requests to server:
    - HTTP requests cause a lot of traffic when you have a lot of tests;
    - POST/PUT requests would insert or change data in database
  - solution: replace browser built-in fn with `mock function` (-> dummy fn that overwrites built-in fn)
    - only test code that's written by you (-> `fetch`, `localStorage` etc. are built into browser, you rely on them);
    - you want to test code and output of my component

```JavaScript
// Example 3
// Async.js
import { useEffect, useState } from 'react';

const Async = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetching = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetching();
  }, []);

  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
};

// Async.test.js
import { render, screen } from '@testing-library/react';
import Async from './Async';

describe('Async component', () => {
  test('renders posts if request succeeds', async () => {
    // Arrange
    // replace fetch fn with mock of globally available jest library
    window.fetch = jest.fn();
    // this sets value when fetch mock is resolved;
    // simulates a resolved res obj having an async json method (-> async since json() returns a new promise normally)
    // returns simply an array with one example of key value pairs needed in the component
    window.fetch.mockResolvedValueOnce({
      json: async () => [{ id: 'p1', title: 'First post' }],
    });
    render(<Async />);
    // Assert
    // use getAllByRole since getByRole fails if there are more than one item
    // get method looks instantly (-> synchronous execution) -> so test would fail with async data fetching;
    // use find method: returns promise; third arg is obj with timeout ms (-> default 1000)
    const listItemsArray = await screen.findAllByRole('listitem', {}, { timeout: 1500 });
    expect(listItemsArray).not.toHaveLength(0);
  });
});
```

# Advices for React Testing Library

> https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

- destructure what you need from `render`, because it returns a collection of utilities; don't use `wrapper` as the variable name for the return value from `render`

  ```JavaScript
  // ❌
  const wrapper = render(<Example prop="1" />)
  wrapper.rerender(<Example prop="2" />)

  // ✅
  const {rerender} = render(<Example prop="1" />)
  rerender(<Example prop="2" />)
  ```

- don't use `cleanup` -> because cleanup happens automatically

  ```JavaScript
  // ❌
  import {render, screen, cleanup} from '@testing-library/react'
  afterEach(cleanup)

  // ✅
  import {render, screen} from '@testing-library/react'
  ```

- use `screen` for querying and debugging

  ```JavaScript
  // ❌
  const {getByRole} = render(<Example />)
  const errorMessageNode = getByRole('alert')

  // ✅
  render(<Example />)
  const errorMessageNode = screen.getByRole('alert')
  ```

- install and use `@testing-library/jest-dom` for the right assertion -> because error messages that I get are much better

  ```JavaScript
  const button = screen.getByRole('button', {name: /disabled button/i})

  // ❌
  expect(button.disabled).toBe(true)
  // error message:
  //  expect(received).toBe(expected) // Object.is equality
  //  Expected: true
  //  Received: false

  // ✅
  expect(button).toBeDisabled()
  // error message:
  //   Received element is not disabled:
  //     <button />
  ```

- learn when `act` is necessary, don't wrap things in `act` unnecessarily -> e.g. `render` and `fireEvent` are already wrapped in `act`

  ```JavaScript
  // ❌
  act(() => {
    render(<Example />)
  })

  const input = screen.getByRole('textbox', {name: /choose a fruit/i})
  act(() => {
    fireEvent.keyDown(input, {key: 'ArrowDown'})
  })

  // ✅
  render(<Example />)
  const input = screen.getByRole('textbox', {name: /choose a fruit/i})
  fireEvent.keyDown(input, {key: 'ArrowDown'})
  ```

- use the right query; look at https://testing-library.com/docs/queries/about/#priority

  ```JavaScript
  // ❌
  // assuming you've got this DOM to work with:
  // <label>Username</label><input data-testid="username" />
  screen.getByTestId('username')

  // ✅
  // change the DOM to be accessible by associating the label and setting the type
  // <label for="username">Username</label><input id="username" type="text" />
  screen.getByRole('textbox', {name: /username/i})
  ```

  - don't use `container` to query elements

    ```JavaScript
    // ❌
    const {container} = render(<Example />)
    const button = container.querySelector('.btn-primary')
    expect(button).toHaveTextContent(/click me/i)

    // ✅
    render(<Example />)
    screen.getByRole('button', {name: /click me/i})
    ```

  - query by the actual text rather than using test IDs etc.

    ```JavaScript
    // ❌
    screen.getByTestId('submit-button')

    // ✅
    screen.getByRole('button', {name: /submit/i})
    ```

  - use `*ByRole` most of the time -> the `name` option allows you to query elements by their `Accessible Name`, it works even if element has text content split up by different elements

    ```JavaScript
    // assuming we've got this DOM structure to work with
    // <button><span>Hello</span> <span>World</span></button>

    screen.getByText(/hello world/i)
    // ❌ fails with the following error:
    // Unable to find an element with the text: /hello world/i. This could be
    // because the text is broken up by multiple elements. In this case, you can
    // provide a function for your text matcher to make your matcher more flexible.

    screen.getByRole('button', {name: /hello world/i})
    // ✅ works!
    ```

- Avoid adding unnecessary or incorrect accessibility attributes -> accessibility attributes should really only be used when semantic HTML doesn't satisfy your use case

  - hint: to make `inputs` accessible via a `role`, specify `type` attribute

  ```JavaScript
  // ❌
  render(<button role="button">Click me</button>)

  // ✅
  render(<button>Click me</button>)
  ```

- Use `@testing-library/user-event` over `fireEvent` where possible -> `userEvent` is built on top of `fireEvent`

  - example: `fireEvent.change` triggers a single change event on input. However the `type` method triggers `keyDown`, `keyPress` and `keyUp` events for each character as well

  ```JavaScript
  // ❌
  fireEvent.change(input, {target: {value: 'hello world'}})

  // ✅
  userEvent.type(input, 'hello world')
  ```

- Use `query*` variants only for asserting that element cannot found

  ```JavaScript
  // ❌
  expect(screen.queryByRole('alert')).toBeInTheDocument()

  // ✅
  expect(screen.getByRole('alert')).toBeInTheDocument()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  ```

- use `find*` any time you want to query for something that should be available async -> `find*` queries use `waitFor` under the hood

  ```JavaScript
  // ❌
  const submitButton = await waitFor(() =>
    screen.getByRole('button', {name: /submit/i}),
  )

  // ✅
  const submitButton = await screen.findByRole('button', {name: /submit/i})
  ```

- wait for a specific assertion inside `waitFor` and only put one assertion in a callback -> purpose of `waitFor` is to allow you to wait for a specific thing to happen that has a non-deterministic amount of time between the action you performed and the assertion passing

  ```JavaScript
  // ❌
  await waitFor(() => {})
  expect(window.fetch).toHaveBeenCalledWith('foo')
  expect(window.fetch).toHaveBeenCalledTimes(1)

  // ❌
  await waitFor(() => {
    expect(window.fetch).toHaveBeenCalledWith('foo')
    expect(window.fetch).toHaveBeenCalledTimes(1)
  })

  // ✅
  await waitFor(() => expect(window.fetch).toHaveBeenCalledWith('foo'))
  expect(window.fetch).toHaveBeenCalledTimes(1)
  ```

- put side-effects outside `waitFor` callbacks -> reserve callback for assertions only

  ```JavaScript
  // ❌
  await waitFor(() => {
    fireEvent.keyDown(input, {key: 'ArrowDown'})
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  // ✅
  fireEvent.keyDown(input, {key: 'ArrowDown'})
  await waitFor(() => {
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
  ```

- If you want to assert that something exists, make that assertion explicit and don't skip assertion

  ```JavaScript
  // ❌
  screen.getByRole('alert', {name: /error/i})

  // ✅
  expect(screen.getByRole('alert', {name: /error/i})).toBeInTheDocument()
  ```
