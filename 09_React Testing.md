# React Testing with React Testing Library and Jest

## Usefull Links

> Cheatsheet React Testing Library: <https://testing-library.com/docs/react-testing-library/cheatsheet/>
> React Testing Library Tutorial: <https://www.robinwieruch.de/react-testing-library/>

## Overview Testing

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
    - most common and important kind of test
    - isolated test: you mock dependencies and test internals of a unit
    - further from how users interact with website
    - more likely to break with refactoring
  - `Integration Tests`:
    - test the combination of multiple building blocks (-> how components work together)
    - projects typically contain a couple of integration tests
    - React specific: in general not so easy to differentiate between integration and unit tests
    - important, but good to focus on unit tests in most cases
  - `End-to-End (e2e) Tests`:
    - use actual browser and Server (e.g. with tools `Cypress`, `Selenium`)
    - test complete scenarios in your app as the user would experience them
    - projects typically contain only a few e2e tests
    - important but can also be done manually (partially)
- What and how to test?
  - test the different building blocks
  - unit tests = the smallest building blocks that make up your app
  - test success and error cases, test all possible scenarios (-> rare (but possible) results)

## TDD (Test-Driven Development)

- write tests before writing code
- then write code accodring to specifications set by tests
- process:
  1. write empty "shell" function in your file
  1. write tests -> expect tests to fail
  1. write code -> then tests pass

## Tools & Setup

> Jest and React Testing Library are already set up when using create-react-app

1. [Jest]('https://jestjs.io/'):

   - a general JavaScript Testing Framework (-> not specific for React)
   - tool for test running -> finds and runs tests and determines whether tests pass or fail

1. [React Testing Library]('https://testing-library.com/'):

   - creates virtual DOM for "simulating" (-> rendering) the React app/components
   - provides utilities for interacting with virtual DOM: searching (-> getBy\* etc.) and user actions
   - allows testing without a browser

1. [React Hooks Testing Library]('https://react-hooks-testing-library.com/'): tool for testing custom React hooks

1. ESLint Plugins for React Testing Library and Jest DOM:

   - eslint is already installed when using create-react-app
   - install Plugins: `npm i eslint-plugin-testing-library eslint-plugin-jest-dom`
   - go to package.json, delete the following

   ```JSON
    "eslintConfig": {
       "extends": [
         "react-app",
         "react-app/jest"
       ]
     },
   ```

   - create new `.eslintrc.json` in root folder and insert configuration:

   ```JSON
    {
      "plugins": ["testing-library", "jest-dom"],
      "extends": [
        "react-app",
        "react-app/jest",
        "plugin:testing-library/react",
        "plugin:jest-dom/recommended"
      ]
    }
   ```

   - example of rules and plugins (tutorial teacher udemy)

   ```JSON
    {
      "extends": [
        "airbnb",
        "plugin:testing-library/recommended",
        "plugin:testing-library/react",
        "plugin:@typescript-eslint/recommended",
        "react-app",
        "react-app/jest",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended"
      ],
      "settings": {
        "import/resolver": {
          "node": {
            "extensions": [".js", ".jsx", ".ts", ".tsx"],
            "paths": ["src"]
          }
        }
      },
      "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
        "ecmaFeatures": {
          "jsx": true
        }
      },
      "plugins": [
        "testing-library",
        "jest-dom",
        "sonarjs",
        "jsx-a11y",
        "@typescript-eslint",
        "simple-import-sort",
        "prettier"
      ],
      "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "jest": true
      },
      "rules": {
        "import/no-extraneous-dependencies": [2, { "devDependencies": true }],
        "testing-library/await-async-query": "error",
        "testing-library/no-await-sync-query": "error",
        "testing-library/no-debug": "warn",
        "jest-dom/prefer-checked": "error",
        "jest-dom/prefer-enabled-disabled": "error",
        "jest-dom/prefer-required": "error",
        "jest-dom/prefer-to-have-attribute": "error",
        "react/prop-types": ["off"],
        "sonarjs/cognitive-complexity": ["error", 5],
        "max-lines-per-function": ["warn", 50],
        "react/jsx-filename-extension": [1, { "extensions": [".tsx", ".jsx"] }],
        "import/extensions": ["error", "never"],
        "import/no-unresolved": 2,
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "sort-imports": "off",
        "import/order": "off",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/react-in-jsx-scope": "off",
        "prettier/prettier": "error",
        "react/jsx-one-expression-per-line": "off",
        "react/jsx-curly-newline": "off"
      }
    }
   ```

   - create new folder `.vscode` in root directory with file `settings.json` and insert:

   ```JSON
    {
      // where to find custom config file
      "eslint.options": {
        "overrideConfigFile": ".eslintrc.json"
      },
      // which files to check with eslint
      "eslint.validate": ["javascript", "javascriptreact"]
    }
   ```

   - add `.vscode` and `.eslintcache` to `.gitignore`

   > Add VSCode settings file to global VSCode settings: <https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations>

## Testing React Components & Building Blocks

- `npm test` react script starts jest in watch mode: tests are executed and file changes are watches

  - watch mode:
    - watches changes in files since last commit
    - only run tests related to these files, unless you wanna run all test

- 3 "A"s of writing tests:

  - `Arrange`: set up test data, test conditions and test environment
  - `Act`: run logic that should be tested (e.g. execute fn)
  - `Assert`: have a look inside the browser and compare received results with expected results

- `describe()` fn is globally available to create `testing suite` to group tests

  - 2 args: a) description string, b) anonymous fn that contains all test fns in the fn body
  - `good practice`: test suite description and test fn description form nice sentences to understand the aim of a test

- `test()` is globally available, receives 2 args:

  1. description of test (`string`) to identifie test in output
  1. anonymous fn containing testing code
  1. test fails if error is thrown in fn (e.g. if assertions fail)

- `render(<App />)` creates virtual DOM (a simulated browser) for a JSX argument (-> a component and his entire component tree)

- `screen` allows access the virtual DOM:

  > Which query to use? <https://testing-library.com/docs/queries/about/#priority>

  - types of query methods in screen obj:

    - `getBy...`: returns element or `throw error` if element is not found
    - `queryBy...`: returns element or `null` if element is not found (NOT throw error),
      - when you are asserting that an element is NOT there: like `expect(screen.queryByText(/suchen/i)).toBeNull()`
      - even though getBy... throws error if element is not found and `expect` statement wouldn't be reached, it's more readable and good practice to write direct assertion
    - `findBy...`: returns `Promise`
      - for async tasks if element is eventually on the screen or for second rendering of component if element is eventually on the screen
    - search variants for multiple elements: return array of elements if found
      - `getAllBy`: throws error if nothing found
      - `queryAllBy`: returns empty array if nothing found
      - `findAllBy`: returns Promise

  - search types of query methods: use priority a) over b) over c)

    - a) Accessible by every user
      - getByText (most preferred - element text content)
      - getByRole (most preferred - aria role)
      - getByLabelText (label or aria-label text content)
      - getByPlaceholderText (input placeholder value)
      - getByDisplayValue (form element current value)
    - b) Semantic Queries
      - getByAltText (img alt attribute)
      - getByTitle (title attribute or svg title tag)
    - c) Test ID
      - getByTestId (data-testid attribute on element)

  - 2nd argument of query methods is options object

    - example 1: `{ exact: false/true }`

      ```JavaScript
      // without `exact: false`, `Hello World` wouldn't match `Hello World!`
      screen.getByText('Hello World', { exact: false })
      // true: default
      // false: casing doesn't matter and match occurs also for substrings
      ```

    - example 2: `{ name: /link text/i }`

      ```JavaScript
      // find element with role 'link' and accessibility name
      screen.getByRole('link', { name: /link text/i})
      ```

- `role` of HTML element:

  - some elements have built-in roles: button, a, input (when type is defined) etc.
  - overview roles <https://www.w3.org/TR/html-aria/#docconformance>

- `userEvent` to simulate user actions

  - add multiple interaction methods: <https://github.com/testing-library/user-event>
  - is to be prefered over `fireEvent`

- `expect()` (-> Jest global fn starts assertion) with `matcher` method from Jest-DOM: e.g. `expect(linkElement).toBeInTheDocument()`

- `jest-dom`:

  - comes with create-react-app
  - `src/setupTest.js` imports it before each test, makes matchers available
  - DOM-based matchers: e.g. `toBeVisible()`, `toBeInTheDocument()`, `toBeChecked()`
  - general matchers (that can apply to any node code): `toBe()`, `toHaveLength()`
  - list of `custom matchers`: <https://github.com/testing-library/jest-dom>
    - toBeInTheDocument (most common)
    - toBeNull (most common)
    - toBeDisabled
    - toBeEnabled
    - toBeEmptyDOMElement
    - toBeInvalid
    - toBeRequired
    - toBeValid
    - toBeVisible
    - toContainElement
    - toContainHTML
    - toHaveAccessibleDescription
    - toHaveAccessibleName
    - toHaveAttribute
    - toHaveClass
    - toHaveFocus
    - toHaveFormValues
    - toHaveStyle
    - toHaveTextContent
    - toHaveValue
    - toHaveDisplayValue
    - toBeChecked
    - toBePartiallyChecked
    - toHaveErrorMessage
    - toHaveDescription

## Examples

```JavaScript
// Example 1
// App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  // Arrange
  render(<App />);

  // Act: ...nothing

  // Assert
  // identifie element by a text (-> here: Regex case insensitive);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

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

## Async Testing

### waitForElementToBeRemoved()

- use `waitForElementToBeRemoved` fn as assertion when you're waiting asynchronously that an element disappears from screen

```JavaScript
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('popover appears on hovering', async () => {
  render(<Form />);
  // popover is hidden
  const nullPopover = screen.queryByText(/this is a popover text/i);
  expect(nullPopover).not.toBeInTheDocument();

  // popover appears
  const textToBeHovered = screen.getByText(/i let popover appear/i);
  userEvent.hover(textToBeHovered);
  const popover = screen.getByText(/this is a popover text/i);
  // even though getByText throws error if element is not found and expect statement
  // would not be reached, it's more readable and good practice to write direct assertion
  expect(popover).toBeInTheDocument();

  // popover disappears
  userEvent.unhover(textToBeHovered);
  await waitForElementToBeRemoved(() => screen.queryByText(/this is a popover text/i));
});
```

### HTTP requests

- problem: during development, DON'T send real HTTP requests to server:
  - HTTP requests cause a lot of traffic when you have a lot of tests;
  - POST/PUT requests would insert or change data in database
- solution: replace browser built-in fn with `mock function` (-> dummy fn that overwrites built-in fn)
  - only test code that's written by you (-> `fetch`, `localStorage` etc. are built into browser, you rely on them);
  - you want to test code and output of my component

```JavaScript
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

## Advices for React Testing Library

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
