import { Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';

const App = () => {
  return (
    <div>
      <Header />
      <main>
        <Switch>
          {/* exact is always needed, when there are more than one Route that matches the path
          since only always first path match is displayed inside the Switch component */}
          {/* use Redirect component to redirect user */}
          <Route path='/' exact>
            <Redirect to='/welcome' />
          </Route>
          {/* imported Route is a component with props that allows 
          to define certain path and component that should be rendered;
          ALL paths that match e.g. '/welcome' are rendered and became active 
          (-> also e.g. .../welcome/abc)
          SOLUTION: wrap all Route components into Switch component, then only 
          the first Route that is matched (AND it matches only the start of a path like '/products') 
          would be active at the same time;
          prop exact tells React Router that this path leads only to match if there is exact match */}
          <Route path='/welcome'>
            <Welcome />
          </Route>
          <Route path='/products' exact>
            <Products />
          </Route>
          {/* dynamic routes with params;
          :productId is a dynamic placeholder that accepts every value;
          inside wrapped component you can get access to param ':productId' */}
          <Route path='/products/:productId'>
            <ProductDetail />
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default App;
