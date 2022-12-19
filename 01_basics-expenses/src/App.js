// this import is no longer needed in modern React version
// import React from 'react';
import { useState } from 'react';

import NewExpense from './components/NewExpense/NewExpense';
import Expenses from './components/Expenses/Expenses';

// example data outside of component to avoid recreating of const while rerendering of component
const DUMMY_DATA = [
  {
    id: 'e1',
    title: 'E-Bike',
    amount: 4799,
    date: new Date(2020, 7, 14), // create date obj
  },
  { id: 'e2', title: 'Laptop', amount: 1799, date: new Date(2021, 1, 12) },
  {
    id: 'e3',
    title: 'Table',
    amount: 300,
    date: new Date(2021, 2, 28),
  },
  {
    id: 'e4',
    title: 'Desk',
    amount: 450,
    date: new Date(2021, 5, 12),
  },
];

const App = () => {
  const [expenses, setExpenses] = useState(DUMMY_DATA);

  const addExpenseHandler = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  return (
    <div>
      <NewExpense onAddExpense={addExpenseHandler} />
      <Expenses items={expenses} />
    </div>
  );
};

export default App;
