import { Fragment, useEffect, useState } from 'react';
import useHttp from './hooks/useHttp';
import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';

const App = () => {
  const [tasks, setTasks] = useState([]);

  // transform all tasks from objects delivered by Firebase
  // into an object structure that is used in the frontend;
  // important: use useCallback to have the identical fn that is passed
  // as arg into useHttp hook, otherwise would trigger re-execution of
  // sendRequest fn in hook
  // RECOMMANDED SOLUTION: copy transformTasks fn into useEffect and pass it
  // as second arg into fetchTasks fn -> then NO useCallback is needed
  // const transformTasks = useCallback(tasksObj => {
  //   const loadedTasks = [];
  //   for (const taskKey in tasksObj) {
  //     loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
  //   }
  //   setTasks(loadedTasks);

  //   // empty dependency arr because anything external is used
  //   // (other than setTasks, but must not be listed)
  // }, []);

  // rename sendRequest into the alias fetchTasks
  const { isLoading, error, sendRequest: fetchTasks } = useHttp(); // here I can pass arg into my custom hook fn

  useEffect(() => {
    const transformTasks = tasksObj => {
      const loadedTasks = [];
      for (const taskKey in tasksObj) {
        loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
      }
      setTasks(loadedTasks);
    };

    // pass obj for request configuration into fetchTasks fn that is the sendRequest fn in useHttp hook
    fetchTasks(
      {
        url: 'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/tasks.json',
      },
      transformTasks
    );

    // without fetchTasks() wrapped into useCallback in useHttp hook,
    // this dependency array would create infinite loop:
    // -> this dependency would create an infinite loop since all states
    // in custom hook are attached to the component where hook is used
    // -> a state update would trigger re-evaluation of component
    // -> this would recall the custom hook again
    // -> this recreates the sendRequest fn in useHttp and returns a new fn object
    // -> therefore useEffect here will run again
  }, [fetchTasks]);

  const taskAddHandler = task => setTasks(prevTasks => [...prevTasks, task]);

  return (
    <Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks items={tasks} loading={isLoading} error={error} onFetch={fetchTasks} />
    </Fragment>
  );
};

export default App;
