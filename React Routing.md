# Multiple Pages in Single-Page App

## What is Client-Side Routing?

- if URL path changes, visible content changes
- traditional way: different HTML files are requested and loaded
- when building complex user interfaces, we typically build `Single Page Applications (SPAs)`
  - only 1 initial HTML request & response, after JavaScript take over
  - Page (URL) changes are then handled by client-side (React) code -> changes visible content without fetching new HTML file

## Using React-Router

- third party package [React Router]('https://reactrouter.com/')
- helps to handle different paths on the page and render components for these
- `BrowserRouter` component: in `index.js` wrap App component to activate React Router
- `Route` is a component with props that allows to define certain path and component that should be rendered; ALL paths that match e.g. `/test` are rendered and became active (-> also e.g. `/test/abc`)
- `Switch` component: can wrap Route components -> then only first Route that matches (AND it matches only the first part of a path like `/test`) would be active at the same time
- prop `exact` tells React Router that this path leads only to match if there is exact match - so notice: in Switch `exact` is always needed, when there are more than one Route that matches the path, and without Switch when I wanna render only one exact component
- `Redirect` component to redirect user
- dynamic routes with params: `:id` is a dynamic placeholder that accepts every value in URL path; inside wrapped component you can get access to param `:id` with `useParams()` hook
  - hook allows catching of dynamic param in URL path;
  - returns obj with key(s) of all dynamic placeholders used in URL path (can use multiple): `const { id } = useParams()`
- `Not Found 404` fallback page with wildcard `*` that matches every other incoming URL -> should come last that it not consume one of the above paths

  ```JavaScript
  import { BrowserRouter as Router } from 'react-router-dom';
  // ... import statements

  ReactDOM.render(
    <Router>
      <App />
    </Router>,
    document.getElementById('root')
  );

  // App.js
  import { Route, Switch, Redirect } from 'react-router-dom';
  // ... import components

  const App = () => {
    return (
      <>
        <Header />
        <main>
          <Switch>
            <Route path='/' exact>
              <Redirect to='/test' />
            </Route>
            <Route path='/test'>
              <Test />
            </Route>
            <Route path='/products' exact>
              <Products />
            </Route>
            <Route path='/products/:productId'>
              <ProductDetail />
            </Route>
            <Route path='*'>
              <NotFound />
            </Route>
          </Switch>
        </main>
      </>
    );
  };
  ```

- nested routes: can use Routes wherever I want -> in example below if `/test` page is active, Route is evaluated -> in `/test` path only a nested path like `/test/1` would work to display a wished component
- programmatic navigation: redirection action is triggered by code, NOT by a click of user; use `useHistory` hook that allows to change the browser history -> returns obj with methods

  - `replace()` is like a redirect and replaces current page (back btn is NOT working);
  - whereas `push()` pushes new page on the stack of pages (back btn is possible)
  - pushing or replacing a page leads to re-evaluation of target component(s), even if target is same page

  ```JavaScript
  import { useHistory } from 'react-router-dom';

  const Test = () => {
    const history = useHistory();
    const dummyFn = () => history.push('/products');

    return (
      <section>
        <Route path='/test/1'>
          <p>Welcome in the nested route</p>
        </Route>
      </section>
    );
  };

  ```

- `Link` component: allows to change path without refreshing whole page
- `NavLink` component: sets css class on active anchor item that you can style active link differently

  ```JavaScript
  import { NavLink } from 'react-router-dom';
  import classes from './Header.module.css';

  const Header = () => {
    return (
      <header className={classes.header}>
        <nav>
          <ul>
            <li>
              <NavLink activeClassName={classes.active} to='/test'>
                Test
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    );
  };
  ```

- `Prompt` component: preventing possibly unwanted route transitions - takes 2 props:

  1. `when` can be `true` or `false` and enables or disables component;
  2. `message` is anonymous fn with parameter of location obj and a msg string in fn body

  ```JavaScript
  import { useRef, useState } from 'react';
  import { Prompt } from 'react-router-dom';

  const Form = ({ onAddQuote, isLoading }) => {
    const [isEntering, setIsEntering] = useState(false);
    const authorInputRef = useRef();
    const textInputRef = useRef();

    const submitFormHandler = (e) => {
      // ... do something
    };

    const formFocusedHandler = () => setIsEntering(true);
    const finishEnteringHandler = () => setIsEntering(false);

    return (
      <>
        <Prompt
          when={isEntering}
          message={(location) => `You want to leave ${location.pathname}? Entered data will be lost.`}
        />
        <form onFocus={formFocusedHandler} onSubmit={submitFormHandler}>
          <div>
            <label htmlFor='text'>Text</label>
            <textarea id='text' rows='5' ref={textInputRef} />
          </div>
          <div>
            <button onClick={finishEnteringHandler}>Add</button>
          </div>
        </form>
      </>
    );
  };
  ```

- working with `query parameters`: example of sorting quotes by ascending or descending order

  - using useHistory and useLocation hooks: whereas `useHistory` gives access to browser history obj, `useLocation` gives access to currently loaded page

  ```JavaScript
  import { useHistory, useLocation } from 'react-router-dom';
  import QuoteItem from './QuoteItem';
  import classes from './QuoteList.module.css';

  // sorting helper fn:
  // if a.id ist größer als b.id, dann soll b vor a sortiert werden;
  // if a.id ist kleiner als b.id, dann soll a vor b sortiert bleiben
  const sortQuotes = (quotes, ascending) => {
    return quotes.sort((quoteA, quoteB) => {
      if (ascending) {
        return quoteA.id > quoteB.id ? 1 : -1;
      } else {
        return quoteA.id < quoteB.id ? 1 : -1;
      }
    });
  };

  const QuoteList = ({ quotes }) => {
    const history = useHistory();
    const location = useLocation();

    // default JS class URLSearchParams that returns obj
    // that contains all query params key value pairs
    const queryParams = new URLSearchParams(location.search);
    const ascending = queryParams.get('sort') === 'asc';

    const sortedQuotes = sortQuotes(quotes, ascending);

    const changeSortingHandler = () => {
      // if quotes are currently sorted ascendingly
      // then new query param after click would be 'desc'
      history.push(`/quotes?sort=${ascending ? 'desc' : 'asc'}`);
    };

    return (
      <>
        <div className={classes.sorting}>
          <button onClick={changeSortingHandler}>
            Sort {ascending ? 'Descending' : 'Ascending'}
          </button>
        </div>
        <ul className={classes.list}>
          {sortedQuotes.map((quote) => (
            <QuoteItem key={quote.id} id={quote.id} author={quote.author} text={quote.text} />
          ))}
        </ul>
      </>
    );
  };
  ```
