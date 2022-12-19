import useHttp from '../../hooks/useHttp';
import Section from '../UI/Section';
import TaskForm from './TaskForm';

const NewTask = ({ onAddTask }) => {
  const { isLoading, error, sendRequest: sendTaskRequest } = useHttp();

  const createTask = (taskText, taskData) => {
    const generatedId = taskData.name; // firebase-specific => "name" contains generated id
    const createdTask = { id: generatedId, text: taskText };
    onAddTask(createdTask);
  };

  const enterTaskHandler = async taskText => {
    // renamed sendRequest fn of useHttp hook
    sendTaskRequest(
      {
        url: 'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/tasks.json',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { text: taskText },
      },
      // instead of copy pasting createTask fn inside the enterTaskHandler to have access to 'taskText' variable,
      // you can also use bind method here to preconfigure the function and add a new arg when fn is executed;
      // first arg of bind() is always this keyword (here: not needed, so it's null)
      createTask.bind(null, taskText)
    );
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;
