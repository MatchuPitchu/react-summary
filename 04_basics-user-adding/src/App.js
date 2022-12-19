import { useState } from 'react';

import AddUser from './components/Users/AddUser';
import UsersList from './components/Users/UsersList';

const App = () => {
  const [usersList, setUsersList] = useState([]);

  const addUserHandler = (name, age) => {
    // add new obj at the beginning of arr;
    // -> because params name and age have same name than obj keys, I can use shorthand
    setUsersList((prev) => [
      { name, age, id: Math.random().toString() },
      ...prev,
    ]);
  };

  return (
    <div>
      <AddUser onAddUser={addUserHandler} />
      <UsersList users={usersList} />
    </div>
  );
};

export default App;
