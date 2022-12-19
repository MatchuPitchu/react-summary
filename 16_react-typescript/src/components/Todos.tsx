import { useContext } from 'react';
import { TodosContext } from '../store/Context';
import TodoItem from './TodoItem';
import classes from './Todos.module.css';

// 1) with passing props:
// you can use class name like a type definition
// import Todo from '../models/todo';

// React.FC is generic fn type for React functional components;
// advantage: have support for built-in props (-> children) without defining it everytime on your own;
// merge your props type obj with built-in base props inside of <>;
// React.FC is generic type and I explicitly set the concrete props type used in this component;
// generic means here that different fn components have different props definitions
// const Todos: React.FC<{ items: Todo[]; removeTodo: (id: string) => void }> = ({
//   items,
//   removeTodo,
// }) => {

// 2) with Context:
const Todos: React.FC = () => {
  const { items, removeTodo } = useContext(TodosContext);

  return (
    <ul className={classes.todos}>
      {items.map((item) => (
        // pass id as argument into fn
        // 1) remove.bind(null, item.id)
        // bind method to prepare my removeTodo fn for further execution that item.id is passed in later as arg;
        // bind first arg is always "this" keyword, but don't need it here, so it's null;
        // 2) use anonymous fn
        <TodoItem key={item.id} text={item.text} removeTodo={() => removeTodo(item.id)} />
      ))}
    </ul>
  );
};

export default Todos;
