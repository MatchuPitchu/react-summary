# Multiple Pages in Single-Page App

## What is Client-Side Routing?

- if URL path changes, visible content changes
- traditional way: different HTML files are requested and loaded
- when building complex user interfaces, we typically build `Single Page Applications (SPAs)`
  - only 1 initial HTML request & response, after JavaScript take over
  - Page (URL) changes are then handled by client-side (React) code -> changes visible content without fetching new HTML file

## Using React-Router v6 (examples v5 look below)

[Documentation for upgrading from v5](https://reactrouter.com/docs/en/v6/upgrading/v5)

- third party package [React Router]('https://reactrouter.com/')
- helps to handle different paths on the page and render components for these

- `BrowserRouter` component: in `index.js` wrap App component to activate React Router

  ```JavaScript
  import { BrowserRouter as Router } from 'react-router-dom';
  // ... import statements

  ReactDOM.render(
    <Router>
      <App />
    </Router>,
    document.getElementById('root')
  );
  ```

- `Route` is a component with props that allows to define certain path and component that should be rendered

  - v6: to be rendered elements are passed via `element` prop as JSX into `<Route>`
  - v5: elements were wrapped `<Route> <Component/> </Route>`

- `Routes` component always have to wrap `Route` components -> order of Route components doesn't matter, algorithm takes the best matching path to render

  - v6:
    - `exact` prop inside `Route` (v5) AND its behavior no longer exists -> in v6 Router looks always for exact matches
    - if you want to imitate old behavior to render multiple `<Route>` components, then use `/*` (-> `<Route path='/products/*' />`); if URL path matches roots (here `/products`) then it's rendered
    - BUT notice in this context: internal algorithm of React Router was improved, that Router searches best fit for a path, so if 2 Routes are available `<Route path='/products/*' />` and `<Route path='/products/:productId' />` it would pick the most exact or explicitly declared path (-> here the 2nd one)
  - v5:
    - `Switch` instead of `Routes` AND inside Switch only first Route that matches (AND it matches only the first part of a path like `/test`) would be active at the same time
    - order of Route components are important since Switch searches for first match;

- dynamic routes with params: `:id` is a dynamic placeholder that accepts every value in URL path; inside of the passed element component you can get access to param `:id` with `useParams()` hook

  - hook catches dynamic param in URL path
  - returns obj with key(s) of all dynamic placeholders used in URL path (-> you can use multiple): `const { id } = useParams()`

- `<Navigate>` component to redirect user -> add `replace` prop to `<Navigate>` when you wanna have real redirect (i.e. replace current URL path), otherwise link is only pushed to browser history

  - v5: look at `<Redirect>` component

- `Not Found 404` fallback page with wildcard `*` that matches every other incoming URL -> should come last that it not consume one of the above paths (NOT SURE! TRY OUT)

```JavaScript
// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
// ... import components

const App = () => {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Navigate replace to='/test' />} />
          <Route path='/test' element={ <Test />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:productId' element={<ProductDetail />} />
          <Route path='*'  element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};
```

- Links and nested Routes have `relative paths` depending on the root path of the current component (-> you won't need custom path resolving with useRouteMatch hook anymore)

  - relative path is defined without `/` whereas absolute path is defined with `/`

  ```JavaScript
  // relative path
  <Link to={`${id}`}>
  // absolute path
  <Link to={`/quotes/${id}`}>
  ```

- `nested routes`:
  - when using nested routes then at top level you have to add `/*` in path to tell React Router that the passed element is even displayed if there is no exact path match (-> since nested routes extend the whole path)
  - BUT ATTENTION: only `routes with descendant routes` (defined in other components!) use a trailing `*` in their path to indicate they match deeply
  - nested routes could be defined in the child component as with v5 OR defined directly in the root component wrapped into the root `<Route>`;
    - notice: nested route then still uses relative path;
    - advantage to have all routes in one place;
    - use `<Outlet>` component in child component to position nested route
  - nested routes are now relative paths, so only add extension of root path in child component
  - v5: for more flexible routing code for `nested routes`, in v5 you could use `useRouteMatch` hook (-> look below), no longer needed in v6

```JavaScript
// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
// ... import components

const App = () => {
  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path='/welcome/' element={<Welcome />}>
            <Route path='hello' element={<p>Welcome in the nested route</p>} />
          </Route>
          {/* nested route defined in child component */}
          {/* <Route path='/welcome/*' element={<Welcome />} /> */}
        </Routes>
      </main>
    </div>
  );
};

// Welcome.js
import { Link, Outlet } from 'react-router-dom';

const Welcome = () => {
  return (
    <section>
      <h1>The Welcome Page</h1>
      <Link to='hello'>Link to nested Route</Link>
      {/* nested route defined in child component */}
      {/* <Routes>
        <Route path='hello' element={<p>Welcome in the nested route</p>} />
      </Routes> */}
      <Outlet />
    </section>
  );
};
```

- programmatic navigation: redirection action is triggered by code, NOT by a click of user; use `useNavigate` (v6) hook (-> replaces `useHistory` (v5)) that allows to change the browser history

  ```JavaScript
  const navigate = useNavigate();
  navigate('/welcome', { replace: true });
  ```

  - omit second arg if you wanna push path to browser history `navigate(-1)` instead of replacing -> navigates to previous or forward page (-x or x for xth page before or forward)
  - `replace` is like a redirect and replaces current page (back btn is NOT working);
  - whereas `push` pushes new page on the stack of pages (back btn is possible)
  - pushing or replacing a page leads to re-evaluation of target component(s), even if target is same page

- `Link` component allows to change path without refreshing whole page

- `NavLink` component offers option to set different styles when link is active

  - by passing anonymous fn with parameter obj navData that includes property isActive that is internally changed after click on NavLink
  - v5: there was specific prop called `activeClassName`

  ```JavaScript
  import { NavLink } from 'react-router-dom';
  import classes from './Header.module.css';

  const Header = () => {
    return (
      <header className={classes.header}>
        <nav>
          <ul>
            <li>
             // v5
             <NavLink activeClassName={classes.active} to='/test'>
               Test
             </NavLink>
             // v6
             <NavLink className={(navData) => (navData.isActive ? classes.active : '')} to='/welcome'>
            </li>
          </ul>
        </nav>
      </header>
    );
  };
  ```

- `Prompt` component (-> look below) does not exist in v6 at the moment

- working with `query parameters`: example of sorting quotes by ascending or descending order

  - using `useNavigate` and `useLocation` hooks: whereas `useNavigate` gives access to browser history obj, `useLocation` gives access to currently loaded page

  ```JavaScript
  import { useNavigate, useLocation } from 'react-router-dom';
  import QuoteItem from './QuoteItem';
  import classes from './QuoteList.module.css';

  // sorting helper fn:
  // for ascending true or false, return means the same:
  // return +1 means sort() sorts a to higher index than b;
  // return -1 means sort() sorts a to lower index than b;
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
    const navigate = useNavigate();
    const location = useLocation();

    // default JS class URLSearchParams that returns obj
    // that contains all query params key value pairs
    const queryParams = new URLSearchParams(location.search);
    // evaluates to true or false
    const ascending = queryParams.get('sort') === 'asc';

    const sortedQuotes = sortQuotes(quotes, ascending);

    const changeSortingHandler = () => {
      // 1) pushing a page leads to re-evaluation of target component(s);
      // if quotes are currently sorted ascendingly
      // then new query param after click would be 'desc'
      // navigate(`${location.pathname}?sort=${ascending ? 'desc' : 'asc'}`);
      // 2) alternative way of creating string paths for target destination
      navigate({
        pathname: location.pathname,
        search: `sort=${ascending ? 'desc' : 'asc'}`,
      });
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

### Example for sending & getting data via HTTP with useHttp hook and own request fn library

```JavaScript
// useHttp hook
import { useReducer, useCallback } from 'react';

const httpReducer = (state, action) => {
  if (action.type === 'SEND') {
    return {
      data: null,
      error: null,
      status: 'pending',
    };
  }

  if (action.type === 'SUCCESS') {
    return {
      data: action.resData,
      error: null,
      status: 'completed',
    };
  }

  if (action.type === 'ERROR') {
    return {
      data: null,
      error: action.errorMsg,
      status: 'completed',
    };
  }

  return state;
};

const useHttp = (requestFn, startWithPending = false) => {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? 'pending' : null,
    data: null,
    error: null,
  });

  const sendRequest = useCallback(
    async (requestData) => {
      dispatch({ type: 'SEND' });
      try {
        const resData = await requestFn(requestData);
        dispatch({ type: 'SUCCESS', resData });
      } catch (error) {
        dispatch({
          type: 'ERROR',
          errorMsg: error.message || 'Something went wrong!',
        });
      }
    },
    [requestFn]
  );

  // spread operator converts state object (which is returned from the reducer) into a comma separated list of key/value pairs;
  // these key/value pairs are appended to the object returned from useHttp
  return {
    sendRequest,
    ...httpState,
  };
};

// api.js -> request functions library
const FIREBASE_DOMAIN = 'https://DUMMY.app';

export const getAllQuotes = async () => {
  const res = await fetch(`${FIREBASE_DOMAIN}/quotes.json`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Could not fetch quotes.');

  const transformedQuotes = [];
  for (const key in data) {
    const quoteObj = {
      id: key,
      ...data[key],
    };
    transformedQuotes.push(quoteObj);
  }

  return transformedQuotes;
};

export const getSingleQuote = async (quoteId) => {
  const res = await fetch(`${FIREBASE_DOMAIN}/quotes/${quoteId}.json`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Could not fetch quote.');

  const loadedQuote = {
    id: quoteId,
    ...data,
  };

  return loadedQuote;
};

export const addQuote = async (quoteData) => {
  const res = await fetch(`${FIREBASE_DOMAIN}/quotes.json`, {
    method: 'POST',
    body: JSON.stringify(quoteData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Could not create quote.');

  return null;
};

export const addComment = async (requestData) => {
  const res = await fetch(`${FIREBASE_DOMAIN}/comments/${requestData.quoteId}.json`, {
    method: 'POST',
    body: JSON.stringify(requestData.commentData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Could not add comment.');

  return { commentId: data.name };
};

export const getAllComments = async (quoteId) => {
  const res = await fetch(`${FIREBASE_DOMAIN}/comments/${quoteId}.json`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Could not get comments.');

  const transformedComments = [];
  for (const key in data) {
    const commentObj = {
      id: key,
      ...data[key],
    };
    transformedComments.push(commentObj);
  }

  return transformedComments;
};

// AllQuotes.js -> use case to get data with useHttp hook and request fn library
import { useEffect } from 'react';
import useHttp from '../hooks/useHttp';
import { getAllQuotes } from '../lib/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import QuoteList from '../components/quotes/QuoteList';
import NoQuotesFound from '../components/quotes/NoQuotesFound';

const AllQuotes = () => {
  // second arg is true to start in loading state when fetching data;
  // destructured data array is named with alias loadedQuotes
  const { sendRequest, status, error, data: loadedQuotes } = useHttp(getAllQuotes, true);

  useEffect(() => {
    sendRequest();
    // add sendRequest fn as dependency, BUT will never change
    // because of useCallback used in hook
  }, [sendRequest]);

  if (status === 'pending') return <LoadingSpinner />;
  if (status === 'error') return <p className='centered focused'>{error}</p>;
  if (status === 'complete' && loadedQuotes.length === 0) return <NoQuotesFound />;
  return <QuoteList quotes={loadedQuotes} />;
};

```

## Using React-Router v5 (for Updates v6 look above)

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
    // somewhere invoked function
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
  // for ascending true or false, return means the same:
  // return +1 means sort() sorts a to higher index than b;
  // return -1 means sort() sorts a to lower index than b;
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
    // evaluates to true or false
    const ascending = queryParams.get('sort') === 'asc';

    const sortedQuotes = sortQuotes(quotes, ascending);

    const changeSortingHandler = () => {
      // 1) if quotes are currently sorted ascendingly
      // then new query param after click would be 'desc';
      // use location obj property pathname (-> here correspond to '/quotes')
      // history.push(`${location.pathname}?sort=${ascending ? 'desc' : 'asc'}`);
      // 2) alternative way of creating string paths for target destination
      history.push({
        pathname: location.pathname,
        search: `sort=${ascending ? 'desc' : 'asc'}`,
      });
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

- more flexible routing code for `nested routes` with a) `useRouteMatch` hook and b) `rendering different content` based on URL path

  - a) in nested routes you can use useRouteMatch hook obj to make nested route more flexible for changes in root route
    - `path` - (string) path pattern used to match. Useful for building nested `<Route>s`
    - `url` - (string) matched portion of the URL. Useful for building nested `<Link>s`
  - b) Link is only visible when user is on exact path, after clicking on Link, it disappears

  ```JavaScript
  import { Route, Link, useRouteMatch } from 'react-router-dom';

  const ChildComponent = () => {
    const match = useRouteMatch();

    return (
      <>
        <Route path={match.path} exact>
          <Link to={`${match.url}/comments`}>
            Load Comments
          </Link>
        </Route>
        <Route path={`${match.path}/comments`}>
          <Comments />
        </Route>
      </>
    );
  };
  ```
