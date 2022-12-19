import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';

import Layout from './components/layout/Layout';
import Comments from './components/comments/Comments';
import LoadingSpinner from './components/UI/LoadingSpinner';

// implement lazy loading using React lazy method with anonymous arrow fn
// which resolves to a dynamic import;
// in fn body I call import as a fn and pass path of import;
// finally lazy() is executed by React when new component is needed,
// NOT in advance like normally for all imports;
// lazy creates a separate code chunk which is only downloaded when NewQuote is visited;
// Problem: download of code chunk could take some ms, for meantime you need to define
// a fallback with Suspense component wrapped around Routes;
// fallback is shown when download takes a little bit longer
const NewQuote = lazy(() => import('./pages/NewQuote'));
const QuoteDetail = lazy(() => import('./pages/QuoteDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AllQuotes = lazy(() => import('./pages/AllQuotes'));

const App = () => {
  return (
    // use Layout wrapper component with Navbar and basic styles
    <Layout>
      <Suspense
        fallback={
          <div className='centered'>
            <LoadingSpinner />
          </div>
        }
      >
        <Routes>
          <Route path='/' element={<Navigate replace to='/quotes' />} />
          <Route path='/quotes' element={<AllQuotes />} />
          <Route path='/quotes/:quoteId/*' element={<QuoteDetail />}>
            {/* rendering different content based on URL path: 
          Link is only visible when user is on exact path, 
          after clicking on Link, it disappears */}
            <Route
              path=''
              element={
                <div className='centered'>
                  <Link className='btn--flat' to='comments'>
                    Load Comments
                  </Link>
                </div>
              }
            />
            <Route path='comments' element={<Comments />} />
          </Route>
          <Route path='/new-quote' element={<NewQuote />} />
          {/* Not Found 404 fallback page with wildcard * that matches every other incoming URL */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
