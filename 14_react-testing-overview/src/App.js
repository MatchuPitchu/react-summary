import Greeting from './components/Greeting';
import './App.css';

const App = () => {
  return (
    <div className='App'>
      <Greeting />
      <header className='App-header'>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
