import { useState, useCallback, useMemo } from 'react';
import Button from './components/UI/Button/Button';
import './App.css';
import Demo from './Demo/Demo';
import DemoList from './Demo/DemoList';

const App = () => {
  const [showP, setShowP] = useState(false);
  const [enable, setEnable] = useState(false);

  const toggleBtn = useCallback(() => {
    if (enable) {
      setShowP(prev => !prev);
    }
    // dependency array: memoized version of cb function only changes if one of the dependencies has changed;
    // empty dependencies array means: cb function wrapped into useCallback() will never change;
    // functions in JS are closures which means they close over the values that are available in there environment;
    // so JS logs in all the variables that are used in the fn (here: enable variable) and stores these
    // variables for the fn definition;
    // list all variables, functions etc. - that could change - in dependency array, then in case memoized version
    // of cb fn is recreated
  }, [enable]);

  const enableToggleBtn = useCallback(() => {
    setEnable(true);
  }, []);

  // to see how often component fn is re-executed
  console.log('APP Component');

  // useMemo example
  const [listTitle, setListTitle] = useState('My List');

  const changeTitleHandler = useCallback(() => {
    setListTitle('New title');
  }, []);

  // Notice: items array is always recreated with every re-execution of component
  // because it's a reference value, it's technically never the same array,
  // so you can use useMemo Hook to memoize it
  const listItems = useMemo(() => [5, 3, 1, 10, 9], []);

  return (
    <>
      <div className='app'>
        {/* 1) conditional <p> in same component: 
      <div> parent node flashes, i.e. is updated after removing;
      <p> node flashes, i.e. is added to real DOM after clicking toggle */}
        {/* {showP && <p>New line!</p>} */}

        {/* 2) conditional rendering <p> in child component using props:
      in my case <p> always stays in real DOM tree, so only <p> flashes;
      beside child component, also this component is re-evaluated because 
      here I manage the state */}
        <Demo show={showP} />

        {/* 3) hard coded prop value (-> primitive value):
      if click Toggle, nevertheless all child components along the node tree are 
      re-executed because state changes and following re-evaluation of this component
      includes the return statement with <Demo /> etc. -> child components are 
      then like fn that are re-evaluated too, BUT NO updates in real DOM are 
      triggered because NO changes */}
        {/* <Demo show={false} /> */}

        {/* 4) avoid unnecessary re-evaluation with React.memo():
      tell React only to re-evaluate child component if prop changes;
      wrap child component in React.memo() -> export default React.memo(Demo);
      then React looks at props that this component gets and compares current 
      value(s) to prev value(s) and if no changes then no re-evaluation of all child components;
      Note: DON'T use memo() on every component; memo costs also performance because 
      React has to store prev state and compare it with current; 
      recommanded if hugh component tree AND rare changes of props AND on a high level in the tree, 
      then you can cut of this branch and avoid unnecessary re-render cylces on the entire branch*/}
        {/* <Demo show={false} /> */}

        {/* 5) React.memo() in a child component with fn as props (-> reference value):
      memo() has no cut off branch effect because on every re-execution
      of the App Component, toggleBtn fn is newly recreated;
      solution: useCallback Hook that stores a function in React internal storage across 
      component execution / re-evaluation -> so this function is NOT recreated with every execution 
      and now remains the same for JS */}
        <Button onClick={enableToggleBtn}>Enable Toggle Button</Button>
        <Button onClick={toggleBtn}>Toggle</Button>
      </div>

      <div className='app'>
        <DemoList title={listTitle} items={listItems} />
        {/* Button uses React.memo() and fn that is passed via props uses useCallback, 
        component never reruns */}
        <Button onClick={changeTitleHandler}>Change List Title</Button>
      </div>
    </>
  );
};

export default App;
