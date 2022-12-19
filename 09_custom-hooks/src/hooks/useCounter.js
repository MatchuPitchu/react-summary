import { useState, useEffect } from 'react';

// to make custom hooks configurable, pass arguments
// here: optional forwards parameter (true or false) that is true by default
const useCounter = (forwards = true) => {
  // all states used in custom hook will be tied to every component where hook is used
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forwards
        ? setCounter(prevCounter => prevCounter + 1)
        : setCounter(prevCounter => prevCounter - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [forwards]); // add 'forwards' as dependency to re-run useEffect 'forwards' changes

  // I can return whatever I want: single variable, array, object
  return counter;
};

export default useCounter;
