import React, { useState } from 'react';
import Todo from '../models/todo';

// create type alias to reuse type definition in multiple places
type TodosObj = {
  items: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
};

// specify generic type of argument of createContext fn;
// TodosObj is type definition of arg obj
export const TodosContext = React.createContext<TodosObj>({
  // default value definition
  items: [],
  addTodo: () => {},
  removeTodo: (id: string) => {},
});

// children is a default prop, so don't need to describe its type
const TodosContextProvider: React.FC = ({ children }) => {
  // const DUMMY_TODOS = [new Todo('Learn React'), new Todo('Learn TypeScript')];
  // useState is generic fn -> I can set type of data I wanna store inside
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodoHandler = (text: string) => {
    const newTodo = new Todo(text);
    setTodos((prev) => [newTodo, ...prev]);
  };

  const removeTodoHandler = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const contextValues: TodosObj = {
    items: todos,
    addTodo: addTodoHandler,
    removeTodo: removeTodoHandler,
  };

  return <TodosContext.Provider value={contextValues}>{children}</TodosContext.Provider>;
};

export default TodosContextProvider;
