import classes from './TodoItem.module.css';

// "e: React.MouseEvent" as parameter of removeTodo is not needed here because I don't need it in my use case
const TodoItem: React.FC<{ text: string; removeTodo: () => void }> = ({ text, removeTodo }) => {
  return (
    <li className={classes.item} onClick={removeTodo}>
      {text}
    </li>
  );
};

export default TodoItem;
