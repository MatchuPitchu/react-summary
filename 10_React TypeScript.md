# TypeScript and React

> More detailed information about TypeScript can be found in my TS summary repo

## New React Project with TypeScript

> Information about React and TypeScript: <https://create-react-app.dev/docs/adding-typescript>

> Official TS Documentation, Examples and Playground: <https://www.typescriptlang.org>

> React TypeScript Cheatsheet: <https://github.com/typescript-cheatsheets/react#reacttypescript-cheatsheets>

- `npx create-react-app . --template typescript` -> instead of `.` insert folder name
- React is automatically compiling TS code to JS code
- `@types/...` in `package.json` are type packages that add type annotations to React JS libraries

## Practice Examples

- use a models folder with `ts` files (NOT `tsx`) to define data types used in your app

  - you can use `type`, `interface` or `class` definition
  - class name can be used like a type definition in a component

  ```TypeScript
  // models/todo.ts
  class Todo {
    id: string;
    text: string;

    constructor(todoText: string) {
      this.text = todoText;
      this.id = new Date().toISOString(); // not perfect unique id, but good enough here
    }
  }
  ```

- `React.FC` is the generic fn type for React functional components

  - advantage: you have support for built-in props (-> `children`) without defining them everytime on your own
  - use `<>` to merge your own props type obj with the built-in base props
  - `React.FC` is the generic type and I explicitly set only the concrete props type used in the respective component
  - `generic` means here that different fn components have different props definitions

  ```TypeScript
  interface Props {
    items: Todo[];
    removeTodo: (id: string) => void
  }

  const Todos: React.FC<Props> = ({
    items,
    removeTodo,
  }) => {
    // ... component
  }
  ```

```TypeScript
// Todos.tsx
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

// TodoItem.tsx
// "e: React.MouseEvent" as parameter of removeTodo is not needed here because I don't need it in my use case
const TodoItem: React.FC<{ text: string; removeTodo: () => void }> = ({ text, removeTodo }) => {
  return (
    <li className={classes.item} onClick={removeTodo}>
      {text}
    </li>
  );
};
```

- `useRef<HTMLInputElement>`:
  - define kind of data that `ref` will store, that means which input element will be connected to ref
  - `<HTMLInputElement>` is built-in type -> they are available for all DOM elements, look at `lib` in `tsconfig.json`;
  - to find type name, search `mdn [DOM element]` and have a look at `DOM interface`
- `e: React.FormEvent`: special type for form submission event; `MouseEvent` would it be in case of onClick event

```TypeScript
// NewTodo.tsx
const NewTodo: React.FC = () => {
  const { addTodo } = useContext(TodosContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    // current? not necessary here, because submit fn is only executed when ref has a value;
    // hypothically if element would not exist then value of enteredText would be undefined;
    // use ! if you are sure that current can't be null here
    const enteredText = inputRef.current!.value;

    if (enteredText.trim().length === 0) {
      // throw error
      return;
    }
    addTodo(enteredText);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {/* htmlFor establishes connection with content with the same id */}
      <label htmlFor='text'>Todo text</label>
      <input type='text' id='text' ref={inputRef} />
      <button>Add Todo</button>
    </form>
  );
};
```

- type alias `type TodosObj`: to reuse type definition in multiple places

```TypeScript
// Context.tsx
import React, { useState } from 'react';
import Todo from '../models/todo';

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
```

## tsconfig.json default settings in React

```JSON
{
  "compilerOptions": {
    "target": "es5",
    // included TS libraries
    // -> influences which kind of types are known out of the box by your TS code
    "lib": [
      "dom", // default DOM types
      "dom.iterable",
      "esnext"
    ],
    // also plain JS files allowed in project
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    // strictest possible settings for TS -> all types have to be explicitly defined in places where TS can't infer types
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```
