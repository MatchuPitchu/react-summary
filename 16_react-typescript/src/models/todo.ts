// create models folder with ts files (NOT tsx) to define data types used in my App
// could use 'type', 'interface' or 'class' definition;
class Todo {
  id: string;
  text: string;

  constructor(todoText: string) {
    this.text = todoText;
    this.id = new Date().toISOString(); // not perfect unique id, but good enough here
  }
}

export default Todo;
