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
        </Switch>
      </main>
    </>
  );
};
```

- nested routes: can use Routes wherever I want -> in example below if `/test` page is active, Route is evaluated -> in `/test` path only a nested path like `/test/1` would work to display a wished component

```JavaScript
const Test = () => {
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
