import { Fragment } from 'react';
import BackwardCounter from './components/BackwardCounter';
import ForwardCounter from './components/ForwardCounter';

const App = () => {
  return (
    <Fragment>
      <ForwardCounter />
      <BackwardCounter />
    </Fragment>
  );
};

export default App;
