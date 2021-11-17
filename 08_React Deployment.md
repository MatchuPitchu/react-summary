# Deployment Steps & Pitfalls

## Test Code

- look at `React Testing.md`

## Optimize Code

- with React SPA you build only one big JS code bundle for entire website that every user needs to download when he's visiting website

- `Lazy Loading`:

  - only load certain parts of code when it's needed
  - recommanded for more complexe Apps to reduce size of code bundle AND reduce initial loading time of website
  - easy to implement when using routing since you can split code by routes
  - How to implement?
    - implement lazy loading using `React.lazy()` with anonymous arrow fn which resolves to a dynamic import
    - in fn body call import as a fn and pass import path
    - finally `lazy()` is executed by React when new component is needed, NOT in advance like normally for all imports
    - lazy creates a separate code chunk which is only downloaded when the new component is visited
    - Problem: download code chunk could take some ms
    - Solution: for meantime you need to define a fallback with `Suspense` component wrapped around `Route(s)` -> fallback is shown when download takes a little bit longer

  ```JavaScript
  import { lazy, Suspense } from 'react';
  import { Route, Routes } from 'react-router-dom';
  import LoadingSpinner from './components/UI/LoadingSpinner';

  const AllQuotes = lazy(() => import('./pages/AllQuotes'));
  const NewQuote = lazy(() => import('./pages/NewQuote'));
  const NotFound = lazy(() => import('./pages/NotFound'));

  const App = () => {
    return (
        <Suspense
          fallback={
            <div className='centered'>
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            <Route path='/quotes' element={<AllQuotes />} />
            <Route path='/new-quote' element={<NewQuote />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
    );
  };
  ```

## Build App for production

- execute a script which outputs a production ready minified and optimized bundle of App
- use `npm run build` in CLI to use `build` script defined in `package.json`
- `build folder` is created which holds all content to deploy App -> never change code in this folder since they're overwritten automatically if you rebuild
  - `static folder` contains optimized css & JS code

## Upload production code to server

- Notice: a React SPA is a `Static Website` -> that means it's only made by HTML, CSS & browser/client side JS code, NO server side code involved
- to publish SPA, `Static Site Host` is needed -> google for static website hosting provider
- Example Firebase:
  - create project
  - go to `Hosting` in sidebar
  - click on `Jetzt starten`
  - install Firebass CLI globally `npm install -g firebase-tools` and follow instructions
  - attention to answer to question `What do you want to use as your public directory? (public)`: type in `build`, NOT public
  - `Configure as a single-page app (rewrite all urls to /index.html)? (y/N)`: yes (explanation look below)
  - `File build/index.html already exists. Overwrite?`: no (because I wanna use my own build html file)
  - remove website from internet: `firebase hosting:disable` in CLI

# Server-side Routing vs Client-side Routing and Configure Server

- Client is user using the browser:
  - sends request to server
  - request contains full URL with path like `https://test.de/some-route` that was entered
- Server is remote machine which hosts the production-ready React code
  - sends response to client which contains all HTML, CSS, JS React code
  - JS React code contains React router code which looks for path (i.e. part of URL after domain like `/some-route`) and displays respective components on client-side
- by default when server gets request, server looks for different files for different URLs
- that's not wished behaviour for SPAs -> I wanna ignore path after domain AND always return same response (HTML, CSS, JS) to client
- need to `configure server` -> look into documentation of hosting provider and their: rewrite all urls to /index.html, so that no matter which kind of URL the request was send to, the client returns always same html file which then requests same JS code
