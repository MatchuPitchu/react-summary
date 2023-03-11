import { createStateHook } from './simpleStatemanager';

// Example based on Jack Herringtons Tutorial: https://www.youtube.com/watch?v=f3Cn0CGytSQ
const useCounter = createStateHook(0);

const Counter = () => {
  const [count, setCount] = useCounter();

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Add</button>
      <div>Count: {count}</div>
    </div>
  );
};

function App() {
  return (
    // count state is global(!)
    <>
      <Counter />
      <Counter />
      <Counter />
    </>
  );
}

export default App;
