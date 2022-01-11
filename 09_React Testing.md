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
  1. write empty "shell" component function in your file
  1. write tests -> expect tests to fail
  1. write code -> then tests pass

## Standard Questions to Ask before Writing Tests

1. What to render?
   - the smallest component possible that encompasses everything needed for the tests
1. Do I need to pass props when rendering a component?
   - pass props
1. Do I need to wrap the test into a Provider (Context, Theming, Redux) or in a Router?
   - if in your App, the Provider or Router is outside of your rendered component, you have to make it available in your test and wrap it around this rendered component
1. In which file and directory should I write the respective tests?
   - group tests for a component (-> unit tests)
   - group them for a specific sequence like an order process (-> functional tests)
1. Which behavior in my App needs testing?
1. Hot to test?
   - What queries and events do I use?
1. Is there anything asynchronous in my component?
   - use `async await`

## Tools & Setup

> Jest and React Testing Library are already set up when using create-react-app

1. [Jest]('https://jestjs.io/'):

   - a general JavaScript Testing Framework (-> not specific for React)
   - tool for test running -> finds and runs tests and determines whether tests pass or fail

1. [React Testing Library]('https://testing-library.com/'):

   - creates virtual DOM for "simulating" (-> rendering) the React app/components
   - provides utilities for interacting with virtual DOM: searching (-> getBy\* etc.) and user actions
   - allows testing without a browser

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

   - example of rules and plugins (of tutorial teacher udemy course)

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

   - add `.eslintcache` to `.gitignore`

   > Add VSCode settings file to global VSCode settings: <https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations>

1. [React Hooks Testing Library]('https://react-hooks-testing-library.com/'): tool for testing custom React hooks

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

- `test.only()` and `test.skip()`

  - if you have multiple tests, you can run only one certain with test.only(...) or skip a certain test with test.skip(...)

- `render(<App />)` creates virtual DOM (a simulated browser) for a JSX argument (-> a component and his entire component tree)

- `screen` allows access the virtual DOM:

  > Which query to use? <https://testing-library.com/docs/queries/about/#priority>

  - types of query methods in screen obj:

    - `getBy...`: returns element or `throw error` if element is not found
    - `queryBy...`: returns element or `null` if element is not found (NOT throw error),
      - when you are asserting that an element is NOT there: like `expect(screen.queryByText(/suchen/i)).toBeNull()`
      - even though `getBy...` throws error if element is not found and `expect` statement wouldn't be reached, it's more readable and good practice to write direct assertion
    - `findBy...`: returns `Promise`
      - for async tasks if element is eventually on the screen or for second rendering of component if element is eventually on the screen
    - search variants for multiple elements: return array of elements if found
      - `getAllBy`: throws error if nothing found
      - `queryAllBy`: returns empty array if nothing found
      - `findAllBy`: returns Promise

  - search types of query methods: use priority a) over b) over c)

    - `a) Accessible by every user`
      - getByText (most preferred - element text content)
      - getByRole (most preferred - aria role)
      - getByLabelText (label or aria-label text content)
      - getByPlaceholderText (input placeholder value)
      - getByDisplayValue (form element current value)
    - `b) Semantic Queries`
      - getByAltText (img alt attribute)
      - getByTitle (title attribute or svg title tag)
    - `c) Test ID`
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

- `userEvent` to simulate user actions (-> is to be prefered over `fireEvent`)

  - add multiple interaction methods: <https://github.com/testing-library/user-event>
  - hint: use `clear` method -> when updating a text element with a userEvent, first use `userEvent.clear(element)` to be sure that only wished entry is inserted

- `expect()` (-> Jest global fn starts assertion) with `matcher method` from Jest-DOM: e.g. `expect(linkElement).toBeInTheDocument()`

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
    - toEqual (-> for arrays and objects)
    - toBe (-> for nums and strings)

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

## Jest Mock Function as Props

- when you have fn passed as props to component, you may need to pass this fn also when rendering in tests
  - TypeScript, PropTypes or other prop validators will require
  - OR inside the test, the fn gets called, but this doesn't matter for the test (-> e.g. a fn that calculates a total value but you're not tracking this value in your tests)
- `solution`: use `jest.fn()` -> Jest mock function that does nothing, it's a placeholder to avoid errors

  ```JavaScript
  render(<User updateTotal={jest.fn()}/>)
  ```

## Async Testing

### waitForElementToBeRemoved()

- use `waitForElementToBeRemoved(() => ...) as assertion` when you're waiting asynchronously that an element disappears from screen AND nothing appears instead (-> like a hover effect for a popover)

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

### HTTP requests with Mocks

- problem: during development, DON'T send real HTTP requests to server:
  - HTTP requests cause a lot of traffic when you have a lot of tests;
  - POST/PUT requests would insert or change data in database
- solution: replace browser built-in fn with `mock function` (-> dummy fn that overwrites built-in fn)
  - only test code that's written by you (-> `fetch`, `localStorage` etc. are built into browser, you rely on them);
  - you want to test code and output of my component

#### Using Mock Service Worker

- `Mock Service Worker` mimics response from server

  - `npm i msw`
  - create handlers
  - create test server: listens during tests, sends response, resets after each test

- configure handlers with all wished HTTP requests of RestAPI
  > <https://mswjs.io/docs/basics/response-resolver>

```JavaScript
// ./mocks/handlers.js
import { rest } from 'msw';

// Handles RestAPI (-> rest)
export const handlers = [
  // HTTP method to mock (-> get, post etc.)
  // full URL to mock (-> e.g. http://localhost:3030/users)
  // response resolver function: req (request obj), res (fn to create response), ctx (utility to build response)
  rest.get('http://localhost:3030/users', (req, res, ctx) => {
    return res(
      // simulate which data type I get back of server (-> here array)
      ctx.json([
        { name: 'matchu', imagePath: '/images/matchu.png' },
        { name: 'pitchu', imagePath: '/images/pitchu.png' },
      ])
    );
  }),
];
```

- configure a request mocking server with the given request handlers
  > <https://mswjs.io/docs/getting-started/integrate/node>

```JavaScript
// ./mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

- add configuration of mock service worker to setupTests.js
  > <https://mswjs.io/docs/getting-started/integrate/node>

```JavaScript
import { server } from './mocks/server';
// establish API mocking before all tests
beforeAll(() => server.listen());
// reset any request handlers that are maybe added during tests, that they don't affect other tests
afterAll(() => server.resetHandlers());
// clean up after tests are finished
afterAll(() => server.close());
```

- test component that contains a HTTP request
  - GET request happens in User component
  - with configuration in `setupTest.js`, `handlers.js` and `server.js` test runs component and mock service worker intercepts to the request and sends back handler response

```JavaScript
describe('User component', () => {
  test('displays image for each scoop option from server', async () => {
    render(<Users />);
    // find images with 'avatar' at the end ($) of alt text
    const userAvatars = await screen.findAllByRole('img', { name: /avatar$/i });
    expect(userAvatars).toHaveLength(2);

    // confirm alt text of images (create array of alt texts)
    const altTexts = userAvatars.map(item => item.alt);
    // arrays + objects use toEqual() while nums + string use toBe()
    expect(altTexts).toEqual(['matchu avatar', 'pitchu avatar']);
  });
});
```

- simulate `Error Server Response`

  - import your `server` obj and `rest` obj of `Mock Service Worker` and overwrite defined handlers with new handlers with an error response (here: status code 500)

- `await waitFor(() => {}, options)`: if you need to wait until all of your mock server promises are resolved;

```JavaScript
import { render, screen, waitFor } from '@testing-library/react';
import Users from '../Users';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

describe('Users component', () => {
  test('handles error for users and comments routes', async () => {
    server.resetHandlers(
      rest.get('http://localhost:3030/users', (req, res, ctx) => res(ctx.status(500))),
      rest.get('http://localhost:3030/comments', (req, res, ctx) => res(ctx.status(500)))
    );

    render(<Users />);

    // without waitFor alerts array would only have length 1
    await waitFor(async () => {
      const alerts = await screen.findAllByRole('alert');
      expect(alerts).toHaveLength(2);
    });
  });
});
```

## Testing with Context, Router, Redux Provider and Theming Provider

### Option 1: Wrapper

- inside of render method, use wrapper property in options object to add needed ContextProvider, Router, Redux Provider or Theming Provider

```JavaScript
render(<Example />, { wrapper: ContextProvider });
```

### Option 2: Customize render method (recommended since reusable)

> <https://testing-library.com/docs/react-testing-library/setup/>

- create a proper testing-utils file

```JavaScript
// testing-utils.jsx
import { render } from '@testing-library/react';
import { ContextProvider } from '../store/Context';

// ui: standard name to refer to JSX
// options: obj like the default render method has
const renderWithContext = (ui, options) =>
  render(ui, { wrapper: ContextProvider, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { renderWithContext as render };
```

- in test file: you can import `render` an ALL other methods (`screen`, `waitFor` etc.) from `testing-utils.jsx` OR if you want to have default setup from `@testing-library/react`

## Debugging Tips

- `screen.debug()`: prints out what DOM looks like at this point
- read test error output carefully
  - which assertion is failing
  - copy/paste errors into web search
- Errors and Solvings:
  - `Unable to find role="role"`: Either role doesn't exist, or no element with that role that also matches `name` option
  - `Warning: An update to component inside a test was not wrapped in act(...)`: there was an update to the component after the test completed. Use `await findBy*`
  - `Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.`: there was an update to the component after the test completed. Use `await findBy*`
  - `Error: connect ECONNREFUSED 127.0.0.1`: no Mock Service Worker handler associated with this route and method

## Advices for React Testing Library

> <https://kentcdodds.com/blog/common-mistakes-with-react-testing-library>

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

- use the right query; look at <https://testing-library.com/docs/queries/about/#priority>

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
